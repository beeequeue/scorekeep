import { Connection as DBConnection, Not, IsNull } from 'typeorm'
import { addDays } from 'date-fns'
import gql from 'graphql-tag'
import faker from 'faker'
import uuid from 'uuid/v4'

import { connectToDatabase } from '@/db'
import { Friendship } from '@/modules/friendship/friendship.model'
import { UnclaimedUser } from '@/modules/user/unclaimed-user.model'
import { createApolloClient, generateUser, TestClient } from '@/utils/tests'

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
    const addFriend = gql`
      mutation AddFriend($uuid: ID!) {
        addFriend(uuid: $uuid) {
          uuid
          friendRequests {
            uuid
            initiator {
              uuid
            }
            receiver {
              ... on User {
                uuid
              }
              ... on UnclaimedUser {
                uuid
              }
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
    const acceptFriendRequest = gql`
      mutation AcceptFriendRequest($userUuid: ID!) {
        acceptFriendRequest(userUuid: $userUuid) {
          uuid
          friends {
            ... on User {
              uuid
            }
            ... on UnclaimedUser {
              uuid
            }
          }
          friendRequests {
            uuid
            initiator {
              uuid
            }
            receiver {
              ... on User {
                uuid
              }
              ... on UnclaimedUser {
                uuid
              }
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

  describe('User', () => {
    const friendsQuery = gql`
      query Friends {
        viewer {
          uuid
          friends {
            ... on User {
              uuid
              friendsSince
            }
            ... on UnclaimedUser {
              uuid
              friendsSince
            }
          }
        }
      }
    `

    test('[friends,friendsSince] Gets all accepted friend Users and UnclaimedUsers', async () => {
      const now = new Date()
      const generated = await Promise.all([
        generateUser(), // 0
        generateUser(), // 1
        generateUser(), // 2
        generateUser(), // 3
        // 4
        new UnclaimedUser({
          name: faker.name.firstName() + faker.name.lastName(),
        }).save(),
        // 5
        new UnclaimedUser({
          name: faker.name.firstName() + faker.name.lastName(),
        }).save(),
      ] as const)

      await Promise.all([
        new Friendship({
          initiatorUuid: generated[0].user.uuid,
          receiverUuid: generated[1].user.uuid,
          accepted: addDays(now, 1),
        }).save(),
        new Friendship({
          initiatorUuid: generated[0].user.uuid,
          receiverUuid: generated[2].user.uuid,
          accepted: addDays(now, 2),
        }).save(),
        new Friendship({
          initiatorUuid: generated[0].user.uuid,
          receiverUuid: generated[3].user.uuid,
        }).save(),
        new Friendship({
          initiatorUuid: generated[0].user.uuid,
          receiverUuid: generated[4].uuid,
          accepted: addDays(now, 3),
        }).save(),
        new Friendship({
          initiatorUuid: generated[0].user.uuid,
          receiverUuid: generated[5].uuid,
          accepted: addDays(now, 4),
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
            {
              uuid: generated[5].uuid,
              friendsSince: addDays(now, 4).toISOString(),
            },
            {
              uuid: generated[4].uuid,
              friendsSince: addDays(now, 3).toISOString(),
            },
            {
              uuid: generated[2].user.uuid,
              friendsSince: addDays(now, 2).toISOString(),
            },
            {
              uuid: generated[1].user.uuid,
              friendsSince: addDays(now, 1).toISOString(),
            },
          ],
        },
      })

      expect(response.data.viewer.friends).not.toContain({
        uuid: generated[3].user.uuid,
      })
    })

    describe('friendRequests', () => {
      const fragment = gql`
        fragment FriendRequestFragment on FriendRequest {
          uuid
          initiator {
            uuid
          }
          receiver {
            ... on User {
              uuid
            }
          }
        }
      `
      const friendRequestQueries = {
        viewer: gql`
          query FriendsRequests {
            viewer {
              uuid
              friendRequests {
                ...FriendRequestFragment
              }
            }
          }

          ${fragment}
        `,
        user: gql`
          query FriendsRequests($uuid: ID!) {
            user(uuid: $uuid) {
              uuid
              friendRequests {
                ...FriendRequestFragment
              }
            }
          }

          ${fragment}
        `,
      }

      test('returns friend requests for user', async () => {
        const generated = await Promise.all([
          generateUser(),
          generateUser(),
          generateUser(),
        ] as const)

        await Promise.all([
          new Friendship({
            initiatorUuid: generated[1].user.uuid,
            receiverUuid: generated[0].user.uuid,
          }).save(),
          new Friendship({
            initiatorUuid: generated[0].user.uuid,
            receiverUuid: generated[2].user.uuid,
          }).save(),
        ])

        const response = client.query(friendRequestQueries.viewer, {
          session: generated[0].session,
        })

        await expect(response).resolves.toMatchObject({
          data: {
            viewer: {
              uuid: generated[0].user.uuid,
              friendRequests: [
                {
                  initiator: { uuid: generated[1].user.uuid },
                  receiver: { uuid: generated[0].user.uuid },
                },
                {
                  initiator: { uuid: generated[0].user.uuid },
                  receiver: { uuid: generated[2].user.uuid },
                },
              ],
            },
          },
        })
      })

      test('fails if not owner of user', async () => {
        const generated = await Promise.all([
          generateUser(),
          generateUser(),
        ] as const)

        const response = await client.query(friendRequestQueries.user, {
          session: generated[0].session,
          variables: {
            uuid: generated[1].user.uuid,
          },
        })

        expect(response.errors).toMatchObject([
          {
            message:
              "Access denied! You don't have permission for this action!",
          },
        ])
      })
    })
  })
})
