import request from 'supertest'
import uuid from 'uuid/v4'
import { Connection as DBConnection } from 'typeorm'
import { mocked } from 'ts-jest/utils'

import { createApp } from '@/apollo'
import { connectToDatabase } from '@/db'
import { AuthErrorCode } from '@/constants/auth.constants'
import { Google, GoogleUser } from '@/modules/google/google.lib'
import { User } from '@/modules/user/user.model'
import {
  Connection,
  ConnectionService,
} from '@/modules/connection/connection.model'
import { Session } from '@/modules/session/session.model'

jest.mock('@/modules/google/google.lib')
const mockedGoogle = mocked(Google)

let dbConnection: DBConnection
const app = createApp()

beforeAll(async () => {
  dbConnection = await connectToDatabase()
})

beforeEach(async () => {
  await dbConnection.synchronize(true)
  jest.resetAllMocks()

  mockedGoogle.getTokens.mockResolvedValue({
    idToken: 'id_token',
    token: 'the_token',
    refreshToken: 'refresh_token',
  })
})

afterAll(() => dbConnection.close())

const assertLoggedIn = async (response: request.Response) => {
  expect(response.header).toMatchObject({
    'set-cookie': expect.arrayContaining([expect.stringContaining('token=')]),
  })

  const setCookies = response.header['set-cookie'] as string[]
  const lastCookie = setCookies[setCookies.length - 1]

  const token = /token=([\w\d-])+;/.exec(lastCookie)![0].slice(6, -1)

  expect(token).not.toBeNull()
  expect(token).toMatch(
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  )

  const session = await Session.findOne({ uuid: token })
  expect(session).not.toBeNull()

  expect(session?.user).not.toBeNull()
}

describe('register', () => {
  test('should create user if not logged in and connection doesnt exist', async () => {
    mockedGoogle.getUserFromToken.mockResolvedValue(({
      id: '1234',
      name: 'Jan Jansson',
      email: 'email@gmail.com',
      picture: 'url',
    } as Partial<GoogleUser>) as any)

    const response = await request(app)
      .get('/connect/google/callback')
      .query({ code: '1234' })
      .expect(302)

    await assertLoggedIn(response)
  })
})

describe('login', () => {
  test('should log in if not logged in and connection exists', async () => {
    const connectionUuid = uuid()

    const user = await new User({
      name: 'ExistingUser',
      mainConnectionUuid: connectionUuid,
    }).save()
    const connection = await new Connection({
      uuid: connectionUuid,
      type: ConnectionService.GOOGLE,
      userUuid: user.uuid,
      serviceId: '1234',
      email: 'coolguy@gmail.com',
      image: '',
    }).save()
    const session = await Session.generate(user)

    mockedGoogle.getUserFromToken.mockResolvedValue(({
      id: connection.serviceId,
      email: connection.email,
      picture: connection.image,
    } as Partial<GoogleUser>) as any)

    const response = await request(app)
      .get('/connect/google/callback')
      .query({ code: '1234' })
      .set('Cookie', `token=${session.uuid}`)
      .expect(302)

    expect(response.text).not.toContain('failed')

    await assertLoggedIn(response)
  })
})

describe('connect', () => {
  test('should create connection if logged in already and connection doesnt exist', async () => {
    const oldConnectionUuid = uuid()

    const user = await new User({
      name: 'ExistingUser',
      mainConnectionUuid: oldConnectionUuid,
    }).save()
    await user.connectTo({
      uuid: oldConnectionUuid,
      type: ConnectionService.GOOGLE,
      serviceId: '1234',
      email: 'coolguy@gmail.com',
      image: '',
    })
    const session = await Session.generate(user)

    const newConnectionEmail = 'another@email.com'
    mockedGoogle.getUserFromToken.mockResolvedValue(({
      id: '9876',
      name: 'Google User',
      email: newConnectionEmail,
      picture: 'not-real.png',
    } as Partial<GoogleUser>) as any)

    const response = await request(app)
      .get('/connect/google/callback')
      .query({ code: '1234' })
      .set('Cookie', `token=${session.uuid}`)
      .expect(302)

    expect(response.text).not.toContain('failed')

    const newConnection = await Connection.findOne({
      email: newConnectionEmail,
    })

    expect(newConnection).not.toBeNull()
    expect(newConnection?.userUuid).toBe(user.uuid)
  })

  test('should fail if service account already connected to someone else', async () => {
    const connectionUuid = uuid()

    const oldUser = await new User({
      name: 'FirstUser',
      mainConnectionUuid: connectionUuid,
    }).save()
    const oldConnection = await new Connection({
      uuid: connectionUuid,
      type: ConnectionService.GOOGLE,
      userUuid: oldUser.uuid,
      serviceId: '1234',
      email: 'coolguy@gmail.com',
      image: '',
    }).save()

    const badUser = await new User({
      name: 'BadUser',
      mainConnectionUuid: uuid(),
    }).save()
    const session = await Session.generate(badUser)

    mockedGoogle.getUserFromToken.mockResolvedValue(({
      id: oldConnection.serviceId,
      name: badUser.name,
      email: oldConnection.email,
      picture: oldConnection.image,
    } as Partial<GoogleUser>) as any)

    const response = await request(app)
      .get('/connect/google/callback')
      .set('Cookie', `token=${session.uuid}`)
      .query({ code: '1234' })
      .expect(302)

    expect(response.text).toContain(AuthErrorCode.ANOTHER_USER)
  })
})
