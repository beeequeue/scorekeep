import faker from 'faker'
import gql from 'graphql-tag'
import { Connection as DBConnection } from 'typeorm'

import { connectToDatabase } from '@/db'
import { createApolloClient, generateUser, TestClient } from '@/utils/tests'
import { UnclaimedUser } from '@/modules/user/unclaimed-user.model'
import { Friendship } from '@/modules/friendship/friendship.model'

let client: TestClient
let dbConnection: DBConnection

beforeAll(async () => {
  client = await createApolloClient()
  dbConnection = await connectToDatabase()
})

afterAll(() => dbConnection.close())

beforeEach(async () => {
  await dbConnection.synchronize(true)
})

describe('User', () => {
  describe('getOwners', () => {
    test('returns self', async () => {
      const { user } = await generateUser()

      await expect(user.getOwners()).resolves.toEqual([user])
    })
  })
})

describe('UnclaimedUser', () => {
  describe('getOwners', () => {
    test('returns self and first friend (creator)', async () => {
      const { user } = await generateUser()

      const unclaimedUser = await new UnclaimedUser({
        name: 'Poor Guy',
      }).save()

      await new Friendship({
        initiatorUuid: user.uuid,
        receiverUuid: unclaimedUser.uuid,
        accepted: new Date(),
      }).save()

      await expect(unclaimedUser.getOwners()).resolves.toEqual([unclaimedUser, user])
    })
  })
})

describe('resolvers', () => {
  describe('createFriend', () => {
    const createFriend = gql`
      mutation CreateFriend($name: String!) {
        createFriend(name: $name) {
          __typename
          uuid
          name
          friends {
            uuid
          }
        }
      }
    `

    test('should create UnclaimedUser and make friends with it', async () => {
      const { session, user } = await generateUser()

      const name = faker.name.firstName() + faker.name.lastName()
      const response = await client.mutate(createFriend, {
        session,
        variables: { name },
      })

      expect(response.errors).toBeUndefined()
      expect(response.data).toMatchObject({
        createFriend: {
          __typename: 'UnclaimedUser',
          uuid: expect.anything(),
          name,
          friends: [
            {
              uuid: user.uuid,
            },
          ],
        },
      })
    })
  })
})
