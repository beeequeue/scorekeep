import faker from 'faker'
import { GraphQLError } from 'graphql'
import { createTestClient } from 'apollo-server-integration-testing'

import { connectApolloServer, createApp } from '@/apollo'
import { User } from '@/modules/user/user.model'
import {
  Connection,
  ConnectionService,
} from '@/modules/connection/connection.model'
import { Session } from '@/modules/session/session.model'
import { isNil } from './functional'

export const assertObjectEquals = <T extends {}>(result: T, user: T) => {
  expect(JSON.stringify(result, null, 2)).toEqual(JSON.stringify(user, null, 2))
}

type CreateConnectionOptions = {
  user: User
  uuid?: string
  save?: boolean
}
export const createConnection = async ({
  user,
  uuid,
  save = true,
}: CreateConnectionOptions) => {
  const name = user.name.split(' ')
  const connection = new Connection({
    uuid: uuid ?? faker.random.uuid(),
    type: ConnectionService.GOOGLE,
    userUuid: user.uuid,
    serviceId: faker.random.alphaNumeric(8),
    name: user.name,
    email: faker.internet.email(name[0], name[1]),
    image: faker.image.avatar(),
  })

  if (save) {
    await connection.save()
  }

  return connection
}

type GenerateUserOptions = {
  connectionUuid?: string
}

export const generateUser = async ({
  connectionUuid,
}: GenerateUserOptions = {}) => {
  if (isNil(connectionUuid)) {
    connectionUuid = faker.random.uuid()
  }

  const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`

  const user = await new User({
    name: fullName,
    mainConnectionUuid: connectionUuid,
  }).save()

  const connection = await createConnection({ uuid: connectionUuid, user })

  const session = await Session.generate(user)

  return { user, session, connection }
}

export const createApolloClient = async () =>{
  const server = await connectApolloServer(createApp())
  const client = createTestClient({
    apolloServer: server,
  })

  type GraphQLResponse<D = any> = {
    errors?: GraphQLError[]
    data: D | null
  }

  const graphqlRequest = (type: 'query' | 'mutate') => async <D = any, V extends {} | undefined = undefined>(
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

    const result = await client[type]<GraphQLResponse<D>>(query, {
      variables: options.variables,
    })

    client.setOptions({
      request: {
        headers: {
          authorization: undefined,
        },
      },
    })

    return result
  }

  return {
    client,
    server,
    query: graphqlRequest('query'),
    mutate: graphqlRequest('mutate'),
  }
}

export type TestClient = UnwrapPromise<ReturnType<typeof createApolloClient>>
