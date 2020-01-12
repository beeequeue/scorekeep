import { Boardgame, GAME_TYPE } from '@/modules/boardgame/boardgame.model'
import faker from 'faker'

faker.seed(12)

export const GAMES = {
  azul: {
    boardgame: new Boardgame({
      type: GAME_TYPE.COMPETITIVE,
      name: 'Azul',
      shortName: 'azul',
      aliases: ['アズール', '花磚物語', '아줄'],
      url: 'https://boardgamegeek.com/boardgame/230802/azul',
      rulebook: null,
      minPlayers: 2,
      maxPlayers: 4,
      resultsSchema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        required: ['player', 'winner', 'final'],
        properties: {
          player: {
            type: 'string' as const,
          },
          winner: {
            type: 'boolean' as const,
          },
          final: {
            type: 'number' as const,
          },
        },
      },
    }),
    generateResult: (users: Array<{ uuid: string }>) => {
      const winner = faker.random.arrayElement(users)

      return users.map(user => {
        const isWinner = winner.uuid === user.uuid

        return {
          player: user.uuid,
          winner: isWinner,
          final: isWinner
            ? faker.random.number({ min: 50, max: 80 })
            : faker.random.number(50),
        }
      })
    },
  },
  scythe: {
    boardgame: new Boardgame({
      type: GAME_TYPE.COMPETITIVE,
      name: 'Scythe',
      shortName: 'scythe',
      aliases: ['Серп', '大鎌戦役', '鐮刀戰爭', '사이쓰'],
      url: 'https://boardgamegeek.com/boardgame/169786/scythe',
      rulebook:
        'https://app.box.com/s/rj3jrw0rab2uiz02up89kbant5g8ew1p/file/49368403634',
      minPlayers: 1,
      maxPlayers: 5,
      resultsSchema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        required: [
          'player',
          'winner',
          'final',
          'faction',
          'popularity',
          'stars',
          'territories',
          'twoResources',
          'bonuses',
        ],
        properties: {
          player: {
            type: 'string' as const,
          },
          winner: {
            type: 'boolean' as const,
          },
          final: {
            type: 'number' as const,
          },
          faction: {
            type: 'string' as const,
            enum: ['Red', 'Green', 'Blue', 'Yellow', 'Black'],
          },
          popularity: {
            type: 'number' as const,
          },
          stars: {
            type: 'number' as const,
          },
          territories: {
            type: 'number' as const,
          },
          twoResources: {
            type: 'number' as const,
          },
          bonuses: {
            type: 'number' as const,
          },
        },
      },
    }),
    generateResult: (users: Array<{ uuid: string }>) => {
      const factions = ['Red', 'Green', 'Blue', 'Yellow', 'Black']
      const winner = faker.random.arrayElement(users)

      return users.map((user, i) => {
        const isWinner = winner.uuid === user.uuid

        const results = {
          player: user.uuid,
          winner: isWinner,
          faction: factions[i] ?? faker.random.arrayElement(factions),
          popularity: faker.random.number(!isWinner ? 12 : 18),
          stars: faker.random.number(6),
          territories: faker.random.number(
            !isWinner ? { min: 6, max: 2 * 8 } : { min: 14, max: 28 },
          ),
          twoResources: faker.random.number(
            !isWinner ? { min: 1, max: 2 * 4 } : { min: 8, max: 19 },
          ),
          bonuses: faker.random.number(12),
        }

        return {
          ...results,
          final: results.territories + results.twoResources + results.bonuses,
        }
      })
    },
  },
} as const
