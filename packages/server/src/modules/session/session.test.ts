import { Connection as DBConnection } from 'typeorm'
import httpMock from 'node-mocks-http'

import { connectToDatabase } from '@/db'
import { generateUser } from '@/utils/tests'
import { contextProvider } from './session.lib'

let dbConnection: DBConnection

beforeAll(async () => {
  dbConnection = await connectToDatabase()
})

beforeEach(async () => {
  await dbConnection.synchronize(true)
})

afterAll(() => dbConnection.close())

describe('contextProvider', () => {
  test('should find session from auth header correctly', async () => {
    const { session } = await generateUser()

    const context = await contextProvider(
      httpMock.createMocks({
        headers: { authorization: `Bearer ${await session.getJWT()}` },
      }),
    )

    expect(context.isLoggedIn).toBe(true)
    expect(context.session?.uuid).toBe(session.uuid)
    expect(context.session?.user.uuid).toBe(session.user.uuid)
  })

  test('should find session from cookie correctly', async () => {
    const { session } = await generateUser()

    const context = await contextProvider(
      httpMock.createMocks({
        cookies: {
          token: await session.getJWT(),
        },
      }),
    )

    expect(context.isLoggedIn).toBe(true)
    expect(context.session?.uuid).toBe(session.uuid)
    expect(context.session?.user.uuid).toBe(session.user.uuid)
  })

  test('should handle bad token format without crashing', async () => {
    const context = await contextProvider(
      httpMock.createMocks({
        headers: { authorization: 'asdasdasdasd' },
      }),
    )

    expect(context.isLoggedIn).toBe(false)
    expect(context.session).toBeNull()
  })
})
