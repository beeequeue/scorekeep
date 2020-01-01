import { Connection as DBConnection, Not, IsNull } from 'typeorm'
import uuid from 'uuid/v4'

import { connectToDatabase } from '@/db'
import { createApolloClient, generateUser, TestClient } from '@/utils/tests'
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

describe('resolvers', () => {
  describe('addFriend', () => {
    const addFriend = `
      mutation AddFriend($uuid: ID!) {
        addFriend(uuid: $uuid) {
          uuid
          friendRequests {
            uuid
            initiator {
              uuid
            }
            receiver {
              uuid
            }
          }
        }
      }
    `

    test('should request a friendship', async () => {
      const generated = await Promise.all([generateUser(), generateUser()])

      const response = await client.mutate(addFriend, {
        session: generated[0].session,
        variables: { uuid: generated[1].user.uuid },
      })

      expect(response.errors).toBeUndefined()
      expect(response.data).toMatchObject({
        addFriend: {
          uuid: generated[0].user.uuid,
          friendRequests: [
            {
              initiator: {
                uuid: generated[0].user.uuid,
              },
              receiver: {
                uuid: generated[1].user.uuid,
              },
            },
          ],
        },
      })

      await expect(
        Friendship.findOneOrFail({
          initiatorUuid: generated[0].user.uuid,
          receiverUuid: generated[1].user.uuid,
        }),
      ).resolves.toBeDefined()
    })

    test('handles missing user', async () => {
      const generated = await Promise.all([generateUser()])

      const response = await client.mutate(addFriend, {
        session: generated[0].session,
        variables: { uuid: uuid() },
      })

      expect(response.data).toBeNull()
      expect(response.errors).toMatchObject([
        {
          message: 'Could not find User!',
        },
      ])
    })
  })

  describe('acceptFriendRequest', () => {
    const acceptFriendRequest = `
      mutation AcceptFriendRequest($userUuid: ID!) {
        acceptFriendRequest(userUuid: $userUuid) {
          uuid
          friends {
            uuid
          }
          friendRequests {
            uuid
            initiator {
              uuid
            }
            receiver {
              uuid
            }
          }
        }
      }
    `

    test('should accept a friendship', async () => {
      const generated = await Promise.all([generateUser(), generateUser()])

      await new Friendship({
        initiatorUuid: generated[0].user.uuid,
        receiverUuid: generated[1].user.uuid,
      }).save()

      const response = await client.mutate(acceptFriendRequest, {
        session: generated[1].session,
        variables: { userUuid: generated[0].user.uuid },
      })

      expect(response.errors).toBeUndefined()
      expect(response.data).toMatchObject({
        acceptFriendRequest: {
          uuid: generated[1].user.uuid,
          friends: [
            {
              uuid: generated[0].user.uuid,
            },
          ],
          friendRequests: [],
        },
      })

      await expect(
        Friendship.findOneOrFail({
          initiatorUuid: generated[0].user.uuid,
          receiverUuid: generated[1].user.uuid,
          accepted: Not(IsNull()),
        }),
      ).resolves.toMatchObject({
        accepted: expect.any(Date),
      })
    })
  })
})
