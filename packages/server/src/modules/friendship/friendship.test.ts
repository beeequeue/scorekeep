import { ApolloServer } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import { GraphQLError } from 'graphql'
import { Connection as DBConnection } from 'typeorm'

import { connectApolloServer, createApp } from '@/apollo'
import { connectToDatabase } from '@/db'
import { generateUser } from '@/utils/tests'
import { Session } from '@/modules/session/session.model'

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

const query = async <D = any, V extends {} | undefined = undefined>(
  query: string,
  options: { variables?: V; session?: Session } = {},
): Promise<GraphQLResponse<D>> => {
  if (options.session) {
    client.setOptions({
      request: {
        headers: {
          authorization: `Bearer ${await options.session.getJWT()}`,
        },
      },
    })
  }

  const result = await client.query<GraphQLResponse<D>>(query, {
    variables: options.variables,
  })

  client.setOptions({
    request: {
      headers: {
        authorization: undefined
      }
    }
  })

  return result
}

describe('addFriend', () => {
  const make

  test('should request a friendship', async () => {
    const users = await Promise.all([generateUser(), generateUser()])

    query
  })
})
