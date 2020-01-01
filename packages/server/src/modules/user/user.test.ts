import faker from 'faker'
import { addDays } from 'date-fns'
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

describe('fields', () => {
  describe('friends', () => {
    const friendsQuery = `
      query Friends {
        viewer {
          uuid
          friends {
            ... on User {
              uuid
            }
            ... on UnclaimedUser {
              uuid
            }
          }
        }
      }
    `

    test('Gets all accepted friend Users and UnclaimedUsers', async () => {
      const generated = await Promise.all([
        generateUser(), // 0
        generateUser(), // 1
        generateUser(), // 2
        // 3
        new UnclaimedUser({
          name: faker.name.firstName() + faker.name.lastName(),
        }).save(),
        // 4
        new UnclaimedUser({
          name: faker.name.firstName() + faker.name.lastName(),
        }).save(),
      ] as const)

      await Promise.all([
        new Friendship({
          initiatorUuid: generated[0].user.uuid,
          receiverUuid: generated[1].user.uuid,
          accepted: addDays(new Date(), -1),
        }).save(),
        new Friendship({
          initiatorUuid: generated[0].user.uuid,
          receiverUuid: generated[2].user.uuid,
        }).save(),
        new Friendship({
          initiatorUuid: generated[0].user.uuid,
          receiverUuid: generated[3].uuid,
          accepted: addDays(new Date(), -2),
        }).save(),
        new Friendship({
          initiatorUuid: generated[0].user.uuid,
          receiverUuid: generated[4].uuid,
          accepted: addDays(new Date(), -3),
        }).save(),
      ])

      const response = await client.query(friendsQuery, {
        session: generated[0].session,
      })

      expect(response.errors).toBeUndefined()
      expect(response.data).toMatchObject({
        viewer: {
          uuid: generated[0].user.uuid,
          friends: [
            { uuid: generated[1].user.uuid },
            { uuid: generated[3].uuid },
            { uuid: generated[4].uuid },
          ],
        },
      })

      expect(response.data.viewer.friends).not.toContain({
        uuid: generated[2].user.uuid,
      })
    })
  })
})

describe('resolvers', () => {
  describe('createFriend', () => {
    const createFriend = `
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
