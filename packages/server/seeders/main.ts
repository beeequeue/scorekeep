import { connectToDatabase } from '@/db'
import { Boardgame, GAME_TYPE } from '@/modules/boardgame/boardgame.model'
import { JsonSchemaObject } from '@/types/json-schema'

const createBoardgameSchema = <
  PR extends Omit<JsonSchemaObject, 'type'>,
  MD extends Omit<JsonSchemaObject, 'type'>
>(
  playerResults: PR,
  metaData?: MD,
) => ({
  $schema: 'http://json-schema.org/draft-07/schema#' as const,
  type: 'object' as const,
  required: ['playerResults'],
  properties: {
    playerResults: {
      type: 'array' as const,
      required: ['items'],
      items: {
        ...playerResults,
        type: 'object' as const,
      },
    },
    metaData: {
      ...(metaData ?? {}),
      type: 'object' as const,
    },
  },
})

const insertBoardgames = async () =>
  Promise.all([
    new Boardgame({
      type: GAME_TYPE.COMPETITIVE,
      name: 'Scythe',
      shortName: 'scythe',
      aliases: ['Серп', '大鎌戦役', '鐮刀戰爭', '사이쓰'],
      thumbnail:
        'https://cf.geekdo-images.com/itemrep/img/gLHDC5bCrxd1JhefjJ-VxW2zC54=/fit-in/246x300/pic3163924.jpg',
      url: 'https://boardgamegeek.com/boardgame/169786/scythe',
      rulebook:
        'https://app.box.com/s/rj3jrw0rab2uiz02up89kbant5g8ew1p/file/49368403634',
      minPlayers: 1,
      maxPlayers: 5,
      resultSchema: createBoardgameSchema({
        required: [
          'faction',
          'popularity',
          'stars',
          'territories',
          'twoResources',
          'bonuses',
          'total',
        ],
        properties: {
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
          total: {
            type: 'number' as const,
          },
        },
      }),
    }).save(),
    new Boardgame({
      type: GAME_TYPE.COMPETITIVE,
      name: 'Azul',
      shortName: 'azul',
      aliases: ['アズール', '花磚物語', '아줄'],
      thumbnail:
        'https://cf.geekdo-images.com/itemrep/img/ql-0-t271LVGqbmWA1gdkIH7WvM=/fit-in/246x300/pic3718275.jpg',
      url: 'https://boardgamegeek.com/boardgame/230802/azul',
      rulebook: null,
      minPlayers: 2,
      maxPlayers: 4,
      resultSchema: createBoardgameSchema({
        required: ['score'],
        properties: {
          score: {
            type: 'number' as const,
          },
        },
      }),
    }).save(),
  ])

const run = async () => {
  const conn = await connectToDatabase()

  await insertBoardgames()

  await conn.close()
}

run()
