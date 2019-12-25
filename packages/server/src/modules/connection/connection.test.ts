import { ApolloServer } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import { GraphQLError } from 'graphql'
import { Connection as DBConnection } from 'typeorm'

import { connectApolloServer, createApp } from '@/apollo'
import { connectToDatabase } from '@/db'
import { createConnection, generateUser } from '@/utils/tests'

let server: ApolloServer
let client: ReturnType<typeof createTestClient>
let dbConnection: DBConnection

beforeAll(async () => {
  server = await connectApolloServer(createApp())
  client = createTestClient({
    apolloServer: server,
  })
  dbConnection = await connectToDatabase()
})

afterAll(() => dbConnection.close())

beforeEach(async () => {
  await dbConnection.synchronize(true)
})

type GraphQLResponse<D = any> = {
  errors?: GraphQLError[]
  data: D | null
}

const disconnectQuery = `
  mutation Disconnect($uuid: ID!) {
    disconnect(uuid: $uuid) {
      uuid
      mainConnection {
        uuid
      }
      connections {
        uuid
      }
    }
  }
`

describe('disconnect', () => {
  test('should remove connection and update mainConnection', async () => {
    const { user, session, connection } = await generateUser()
    const secondConnection = await user.connectTo(await createConnection({ user }))

    client.setOptions({
      request: {
        headers: {
          authorization: `Bearer ${await session.getJWT()}`,
        },
      },
    })

    const result = await client.query<GraphQLResponse>(disconnectQuery, {
      variables: {
        uuid: connection.uuid,
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.disconnect).toMatchObject({
      uuid: user.uuid,
      mainConnection: {
        uuid: secondConnection.uuid,
      },
    })

    expect((await user.connections()).length).toBe(1)
  })

  test('fails if only has one connection', async () => {
    const { session, connection } = await generateUser()

    client.setOptions({
      request: {
        headers: {
          authorization: `Bearer ${await session.getJWT()}`,
        },
      },
    })

    const result = await client.query<GraphQLResponse>(disconnectQuery, {
      variables: {
        uuid: connection.uuid,
      },
    })

    expect(result.errors?.[0]).toMatchObject({
      message: 'You need to be connected to at least one service.',
    })
  })

  test('should fail for not logged in users', async () => {
    const { connection } = await generateUser()

    const result = await client.query<GraphQLResponse>(disconnectQuery, {
      variables: {
        uuid: connection.uuid,
      },
    })

    expect(result.errors?.[0]).toMatchObject({
      message: 'Access denied! You need to be authorized to perform this action!',
    })
  })
})
