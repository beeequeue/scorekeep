import { Connection as DBConnection } from 'typeorm'
import gql from 'graphql-tag'

import { connectToDatabase } from '@/db'
import { createApolloClient, generateUser, TestClient } from '@/utils/tests'
import { GAMES } from '@/utils/test-data'

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
  describe('addBoardgame', () => {
    const addBoardgame = gql`
      mutation AddBoardgame(
        $name: String!
        $shortName: String!
        $aliases: [String!]!
        $url: String
        $maxPlayers: Int!
        $resultsSchema: JSONObject!
        $metadataSchema: JSONObject
      ) {
        addBoardgame(
          type: COMPETITIVE
          name: $name
          shortName: $shortName
          aliases: $aliases
          url: $url
          maxPlayers: $maxPlayers
          resultsSchema: $resultsSchema
          metadataSchema: $metadataSchema
        ) {
          uuid
          shortName
          resultsSchema
        }
      }
    `

    test('should add a boardgame', async () => {
      const generated = await generateUser()
      const {
        name,
        shortName,
        aliases,
        url,
        maxPlayers,
        resultsSchema,
        metadataSchema,
      } = GAMES.scythe.boardgame

      const response = await client.mutate(addBoardgame, {
        session: generated.session,
        variables: {
          name,
          shortName,
          aliases,
          url,
          maxPlayers,
          resultsSchema,
          metadataSchema,
        },
      })

      expect(response.errors).toBeUndefined()
      expect(response.data).toMatchObject({
        addBoardgame: {
          uuid: expect.any(String),
          shortName,
          resultsSchema,
        },
      })
    })

    test('should fail without minimum schema', async () => {
      const generated = await generateUser()

      const response = await client.mutate(addBoardgame, {
        session: generated.session,
        variables: {
          name: 'FakeBoardgame',
          shortName: 'fakeboardgame',
          aliases: [],
          url: null,
          maxPlayers: 2,
          resultsSchema: {
            something: {
              type: 'boolean',
            },
          },
          metadataSchema: null,
        },
      })

      expect(response.errors).not.toBeUndefined()
      expect(response.errors).toMatchObject([
        {
          extensions: {
            code: 'BAD_USER_INPUT',
            exception: {
              validation: [
                {
                  message: "should have required property 'type'",
                  path: ['resultsSchema'],
                },
                {
                  message: "should have required property 'required'",
                  path: ['resultsSchema'],
                },
              ],
            },
          },
        },
      ])
    })

    test('should fail without required "player" and "winner" fields', async () => {
      const generated = await generateUser()

      const response = await client.mutate(addBoardgame, {
        session: generated.session,
        variables: {
          name: 'FakeBoardgame',
          shortName: 'fakeboardgame',
          aliases: [],
          url: null,
          maxPlayers: 2,
          resultsSchema: {
            type: 'object',
            required: ['player', 'winner'],
            properties: {},
          },
          metadataSchema: null,
        },
      })

      expect(response.errors).not.toBeUndefined()
      expect(response.errors).toMatchObject([
        {
          extensions: {
            code: 'BAD_USER_INPUT',
            exception: {
              validation: [
                {
                  message: "should have required property 'player'",
                  path: ['resultsSchema', 'properties'],
                },
                {
                  message: "should have required property 'winner'",
                  path: ['resultsSchema', 'properties'],
                },
              ],
            },
          },
        },
      ])
    })

    test("should fail if 'player' and 'winner' fields aren't required", async () => {
      const generated = await generateUser()

      const response = await client.mutate(addBoardgame, {
        session: generated.session,
        variables: {
          name: 'FakeBoardgame',
          shortName: 'fakeboardgame',
          aliases: [],
          url: null,
          maxPlayers: 2,
          resultsSchema: {
            type: 'object',
            required: ['test', 'foo'],
            properties: {
              player: {
                type: 'string',
              },
              winner: {
                type: 'boolean',
              },
            },
          },
          metadataSchema: null,
        },
      })

      console.log(response.errors![0].extensions!.exception.validation)
      expect(response.errors).not.toBeUndefined()
      expect(response.errors).toMatchObject([
        {
          extensions: {
            code: 'BAD_USER_INPUT',
            exception: {
              validation: [
                {
                  message: 'should be equal to one of the allowed values',
                  path: ['resultsSchema', 'required', '[0]'],
                },
                {
                  message: 'should be equal to one of the allowed values',
                  path: ['resultsSchema', 'required', '[1]'],
                },
              ],
            },
          },
        },
      ])
    })
  })
})
