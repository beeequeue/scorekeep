import { Connection as DBConnection } from 'typeorm'
import gql from 'graphql-tag'

import { connectToDatabase } from '@/db'
import { createApolloClient, generateUser, TestClient } from '@/utils/tests'
import { GAMES } from '@/utils/test-data'
import { Boardgame } from '@/modules/boardgame/boardgame.model'

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
        $thumbnail: String!
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
          thumbnail: $thumbnail
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
        thumbnail,
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
          thumbnail,
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
          thumbnail: 'url',
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
                {
                  message: "should have required property 'properties'",
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
          thumbnail: 'url',
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
          thumbnail: 'url',
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

describe('statics', () => {
  describe('getBoardgameNames', () => {
    const testData = [GAMES.azul, GAMES.scythe] as const
    let games: Boardgame[] = []

    beforeEach(async () => {
      games = await Promise.all(testData.map(data => data.boardgame.save()))
    })

    test('returns name:uuid map', async () => {
      const result = await Boardgame.getBoardgameNames()

      const expectedResult = Object.fromEntries(
        games
          .map(boardgame => [
            [boardgame.name, boardgame.uuid],
            [boardgame.shortName, boardgame.uuid],
          ])
          .flat(),
      )

      expect(result).toMatchObject(expectedResult)
    })
  })
})
