import request from 'supertest'
import uuid from 'uuid/v4'
import { Connection as DBConnection } from 'typeorm'
import { mocked } from 'ts-jest/utils'

import { createApp } from '@/apollo'
import { connectToDatabase } from '@/db'
import { AuthErrorCode } from '@/constants/auth.constants'
import { Google } from '@/modules/google/google.lib'
import { User } from '@/modules/user/user.model'
import {
  Connection,
  ConnectionService,
} from '@/modules/connection/connection.model'
import { Session } from '@/modules/session/session.model'

jest.mock('@/modules/google/google.lib')
const mockedGoogle = mocked(Google)

let dbConnection: DBConnection
let app = createApp()

beforeAll(async () => {
  dbConnection = await connectToDatabase()
})

beforeEach(async () => {
  await dbConnection.synchronize()
  app = createApp()
  jest.resetAllMocks()
})

describe('/connect/google', () => {
  test(' should redirect the user to google', async () => {
    const response = await request(app)
      .get('/connect/google')
      .expect(302)

    expect(response.text).toContain('https://accounts.google.com')
  })
})

describe('/connect/google/callback', () => {
  test('should create user if not logged in', async () => {
    mockedGoogle.getTokens.mockResolvedValue({
      idToken: 'id_token',
      token: 'the_token',
      refreshToken: 'refresh_token',
    })
    mockedGoogle.getUserFromToken.mockResolvedValue({
      id: '1234',
      name: 'Jan Jansson',
      email: 'email@gmail.com',
      picture: 'url',
    } as any)

    const response = await request(app)
      .get('/connect/google/callback')
      .query({ code: '1234' })
      .expect(302)

    expect(response.header).toMatchObject({
      'set-cookie': [expect.stringContaining('token=')],
    })

    const token = /token=([\w\d-])+;/
      .exec(response.header['set-cookie'][0])![0]
      .slice(6, -1)

    expect(token).not.toBeNull()
    expect(token).toMatch(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    )

    const session = await Session.findOne({ where: { uuid: token } })
    expect(session).not.toBeNull()

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const user = await session!.getUser()
    expect(user).not.toBeNull()
  })

  test.skip('should only create connection if logged in already', async () => {
    await request(app)
      .get('/connect/google/callback')
      .expect(302, /https:\/\/accounts.google.com/)
  })

  test('should fail if already connected to service', async () => {
    const connectionUuid = uuid()

    const user = await new User({
      name: 'FirstUser',
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

    mockedGoogle.getTokens.mockResolvedValue({
      idToken: 'id_token',
      token: 'the_token',
      refreshToken: 'refresh_token',
    })
    mockedGoogle.getUserFromToken.mockResolvedValue({
      id: connection.serviceId,
      email: connection.email,
      picture: connection.image,
    } as any)

    const response = await request(app)
      .get('/connect/google/callback')
      .query({ code: '1234', state: user.uuid })
      .expect(302)

    expect(response.text).toContain(AuthErrorCode.ALREADY_CONNECTED)
  })

  test('should fail if service user is connected to another user', async () => {
    const connectionUuid = uuid()

    const existingUser = await new User({
      name: 'FirstUser',
      mainConnectionUuid: connectionUuid,
    }).save()

    const connection = await new Connection({
      uuid: connectionUuid,
      type: ConnectionService.GOOGLE,
      userUuid: existingUser.uuid,
      serviceId: '1234',
      email: 'coolguy@gmail.com',
      image: '',
    }).save()

    const badUser = await new User({
      name: 'SecondUser',
      mainConnectionUuid: null,
    }).save()

    mockedGoogle.getTokens.mockResolvedValue({
      idToken: 'id_token',
      token: 'the_token',
      refreshToken: 'refresh_token',
    })
    mockedGoogle.getUserFromToken.mockResolvedValue({
      id: connection.serviceId,
      email: connection.email,
      picture: connection.email,
    } as any)

    const response = await request(app)
      .get('/connect/google/callback')
      .query({ code: '1234', state: badUser.uuid })
      .expect(302)

    expect(response.text).toContain(AuthErrorCode.ANOTHER_USER)
  })
})
