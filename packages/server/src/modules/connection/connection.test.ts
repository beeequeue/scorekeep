import { GraphQLError } from 'graphql'
import { Connection as DBConnection } from 'typeorm'
import { connectToDatabase } from '@/db'
import { createApolloClient, createConnection, generateUser } from '@/utils/tests'

let client: PromiseReturnType<typeof createApolloClient>
let dbConnection: DBConnection

beforeAll(async () => {
  client = await createApolloClient()
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

    const result = await client.query<GraphQLResponse>(disconnectQuery, {
      session,
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

    const result = await client.query<GraphQLResponse>(disconnectQuery, {
      session,
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
