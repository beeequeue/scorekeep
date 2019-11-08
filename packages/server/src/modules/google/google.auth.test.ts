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
    return request(app)
      .get('/connect/google')
      .expect(302, /https:\/\/accounts.google.com/)
  })
})

describe('/connect/google/callback', () => {
  test.skip('should create user if not logged in', async () => {
    await request(app)
      .get('/connect/google/callback')
      .expect(302, /https:\/\/accounts.google.com/)
  })

  test.skip('should only create connection if logged in already', async () => {
    await request(app)
      .get('/connect/google/callback')
      .expect(302, /https:\/\/accounts.google.com/)
  })

  test('should fail if already connected to service', async () => {
    const connectionUuid = uuid()

    const user = await User.from({
      uuid: uuid(),
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
      picture: connection.email,
    } as any)

    const response = await request(app)
      .get('/connect/google/callback')
      .query({ code: '1234', state: user.uuid })
      .expect(302)

    expect(response.text).toContain(AuthErrorCode.ALREADY_CONNECTED)
  })

  test('should fail if service user is connected to another user', async () => {
    const connectionUuid = uuid()

    const existingUser = await User.from({
      uuid: uuid(),
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

    const badUser = await User.from({
      uuid: uuid(),
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
