import { Connection as DBConnection } from 'typeorm'
import gql from 'graphql-tag'

import { connectToDatabase } from '@/db'
import { createApolloClient, generateUser, TestClient } from '@/utils/tests'
import { GAMES } from '@/utils/test-data'
import { Match } from '@/modules/match/match.model'

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
  describe('addMatch', () => {
    const addMatch = gql`
      mutation AddMatch(
        $game: ID!
        $results: [JSONObject!]!
        $metadata: JSONObject
      ) {
        addMatch(game: $game, results: $results, metadata: $metadata) {
          uuid
          game {
            uuid
          }
          players {
            uuid
          }
          winners {
            uuid
          }
          results
        }
      }
    `

    const testData = [GAMES.azul, GAMES.scythe] as const

    beforeEach(async () => {
      await Promise.all(testData.map(data => data.boardgame.save()))
    })

    test('should report a match result', async () => {
      const generated = await Promise.all([
        generateUser(),
        generateUser(),
        generateUser(),
      ])

      const results = testData[0].generateResult(generated.map(d => d.user))

      const response = await client.mutate(addMatch, {
        session: generated[0].session,
        variables: {
          game: testData[0].boardgame.uuid,
          results,
          metadata: null,
        },
      })

      expect(response.errors).toBeUndefined()
      expect(response.data).toMatchObject({
        addMatch: {
          uuid: expect.any(String),
          game: {
            uuid: testData[0].boardgame.uuid,
          },
        },
      })

      expect(
        response.data.addMatch.players
          .map((p: { uuid: string }) => p.uuid)
          .sort(),
      ).toEqual(generated.map(d => d.user.uuid).sort())

      expect(
        response.data.addMatch.winners
          .map((p: { uuid: string }) => p.uuid)
          .sort(),
      ).toEqual(
        results
          .filter(r => r.winner)
          .map(r => r.player)
          .sort(),
      )

      expect(response.data.addMatch.results).toMatchObject(results)
    })

    test('fails on bad result structure', async () => {
      const generated = await generateUser()
      const results = testData[1].generateResult([generated.user])

      // Fuck it up
      results[0].territories = 'test' as any
      results[0].faction = undefined as any

      const response = await client.mutate(addMatch, {
        session: generated.session,
        variables: {
          game: testData[1].boardgame.uuid,
          results,
          metadata: null,
        },
      })

      expect(response.errors).not.toBeUndefined()
      expect(response.errors!.length).toBe(1)

      expect(response.errors![0]).toMatchObject({
        extensions: {
          code: 'BAD_USER_INPUT',
          exception: {
            validation: [
              {
                message: "should have required property 'faction'",
                path: ['results', '[0]'],
              },
              {
                message: 'should be number',
                path: ['results', '[0]', 'territories'],
              },
            ],
          },
        },
      })
    })
  })

  describe('Match', () => {
    describe('winners', () => {
      test('returns winners', async () => {
        const boardgame = await GAMES.azul.boardgame.save()
        const generated = await Promise.all([
          generateUser(),
          generateUser(),
          generateUser(),
        ])

        const results = GAMES.azul.generateResult(generated.map(d => d.user))
        const winner = results.find(result => result.winner)!

        const match = await new Match({
          gameUuid: boardgame.uuid,
          playerUuids: generated.map(d => d.user.uuid),
          winnerUuids: [winner.player],
          results,
          date: new Date(),
        }).save()

        await expect(match.winners()).resolves.toMatchObject([
          { uuid: winner.player },
        ])
      })

      test('returns empty array if no winners exist', async () => {
        const boardgame = await GAMES.azul.boardgame.save()
        const generated = await Promise.all([
          generateUser(),
          generateUser(),
          generateUser(),
        ])

        const match = await new Match({
          gameUuid: boardgame.uuid,
          playerUuids: generated.map(d => d.user.uuid),
          winnerUuids: [],
          results: GAMES.azul.generateResult(generated.map(d => d.user)),
          date: new Date(),
        }).save()

        await expect(match.winners()).resolves.toEqual([])
      })
    })

    describe('players', () => {
      test('returns players', async () => {
        const boardgame = await GAMES.azul.boardgame.save()
        const generated = await Promise.all([
          generateUser(),
          generateUser(),
          generateUser(),
        ])

        const results = GAMES.azul.generateResult(generated.map(d => d.user))

        const match = await new Match({
          gameUuid: boardgame.uuid,
          playerUuids: generated.map(d => d.user.uuid),
          winnerUuids: [generated[0].user.uuid],
          results,
          date: new Date(),
        }).save()

        const players = (await match.players()).map(u => u.uuid).sort()
        expect(players).toMatchObject(generated.map(d => d.user.uuid).sort())
      })
    })
  })
})
