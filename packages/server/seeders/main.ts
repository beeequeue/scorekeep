/* eslint-disable no-console */
import faker from 'faker'
import { addDays } from 'date-fns'

import { connectToDatabase } from '@/db'
import { Boardgame, GAME_TYPE } from '@/modules/boardgame/boardgame.model'
import { Friendship } from '@/modules/friendship/friendship.model'
import { User } from '@/modules/user/user.model'
import { JsonSchemaObject } from '@/types/json-schema'
import { generateUser } from '@/utils/tests'

/**
 * Eras
 *
 * 0-14 (0) -----------
 * Boardgames created
 * Users registered
 * 15-21 (1) ----------
 * Friendships made
 * 22-29 (2) ----------
 * Matches added
 */

faker.seed(12)

const FIRST_DATE = addDays(new Date(), -60)
const eras = [
  FIRST_DATE,
  addDays(FIRST_DATE, 14),
  addDays(FIRST_DATE, 21),
] as const

const random = (min = 0, max = 1) => Math.random() * (max - min) + min

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

// Board games with (mock) in the name don't have a unique result schema
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
      createdAt: faker.date.between(eras[0], eras[1]),
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
      createdAt: faker.date.between(eras[0], eras[1]),
    }).save(),
    new Boardgame({
      type: GAME_TYPE.COMPETITIVE,
      name: 'Terraforming Mars (mock)',
      shortName: 'terraforming-mars',
      aliases: [
        'A Mars terraformálása',
        'Mars: Teraformace',
        'Teraformarea Planetei Marte',
        'Terraformacja Marsa',
        'Покорение Марса',
        'Тераформирай Марс',
        'Тераформування Марса',
        'พลิกพิภพดาวอังคาร',
        'テラフォーミング・マーズ',
        '殖民火星',
        '테라포밍 마스',
      ],
      thumbnail:
        'https://cf.geekdo-images.com/itemrep/img/bhemoxL7PG1a_79L0D9syPTADSY=/fit-in/246x300/pic3536616.jpg',
      url: 'https://boardgamegeek.com/boardgame/167791/terraforming-mars',
      rulebook: null,
      minPlayers: 1,
      maxPlayers: 5,
      resultSchema: createBoardgameSchema({
        required: ['score'],
        properties: {
          score: {
            type: 'number' as const,
          },
        },
      }),
      createdAt: faker.date.between(eras[0], eras[1]),
    }).save(),
    new Boardgame({
      type: GAME_TYPE.COMPETITIVE,
      name: 'Wingspan (mock)',
      shortName: 'wingspan',
      aliases: [
        'Fesztáv',
        'Flügelschlag',
        'Na křídlech',
        'Na skrzydłach',
        'Крылья',
        'ปีกปักษา',
        '展翅翱翔',
        '윙스팬',
      ],
      thumbnail:
        'https://cf.geekdo-images.com/itemrep/img/vb971Kg92dzMd1TM3RBJtQm-XCU=/fit-in/246x300/pic4458123.jpg',
      url: 'https://boardgamegeek.com/boardgame/266192/wingspan',
      rulebook: null,
      minPlayers: 1,
      maxPlayers: 5,
      resultSchema: createBoardgameSchema({
        required: ['score'],
        properties: {
          score: {
            type: 'number' as const,
          },
        },
      }),
      createdAt: faker.date.between(eras[0], eras[1]),
    }).save(),
    new Boardgame({
      type: GAME_TYPE.COMPETITIVE,
      name: 'Gloomhaven (mock)',
      shortName: 'gloomhaven',
      aliases: [
        'Gloomhaven.Мрачная Гавань',
        'Homályrév',
        '幽港迷城',
        '글룸헤이븐',
      ],
      thumbnail:
        'https://cf.geekdo-images.com/itemrep/img/P7MVqNuhAl8Y4fxiM6e74kMX6e0=/fit-in/246x300/pic2437871.jpg',
      url: 'https://boardgamegeek.com/boardgame/174430/gloomhaven',
      rulebook: null,
      minPlayers: 1,
      maxPlayers: 4,
      resultSchema: createBoardgameSchema({
        required: ['score'],
        properties: {
          score: {
            type: 'number' as const,
          },
        },
      }),
      createdAt: faker.date.between(eras[0], eras[1]),
    }).save(),
  ])

const insertUsers = async () =>
  Promise.all(
    Array.from({ length: 25 }).map(() =>
      generateUser({
        createdAt: faker.date.between(eras[0], eras[1]),
      }),
    ),
  )

const createFriendGroups = async (users: User[]) => {
  const userGroups: User[][] = []

  for (let i = 0; i < 5; i++) {
    userGroups.push(users.slice(i * 5, i * 5 + 5))
  }

  const promises = userGroups
    .map(group => {
      const leader = group[0]
      return group.map(async (user, i) => {
        if (i === 0) return

        const createdAt = faker.date.between(eras[1], eras[2])
        await new Friendship({
          initiatorUuid: leader.uuid,
          receiverUuid: user.uuid,
          createdAt,
          accepted: addDays(createdAt, Math.round(Math.random() * 14)),
        }).save()
      })
    })
    .flat()

  await Promise.all(promises)

  return userGroups
}

const run = async () => {
  const conn = await connectToDatabase()

  const boardgames = await insertBoardgames()
  console.log('------------------------------------------')
  console.log(`Inserted ${boardgames.length} board games!`)
  console.log(boardgames.map(game => game.name).join(', '))

  const userDatas = await insertUsers()
  console.log('------------------------------------------')
  console.log(`Inserted ${userDatas.length} users!`)

  const friendGroups = await createFriendGroups(userDatas.map(d => d.user))
  console.log('------------------------------------------')
  console.log(`Created ${friendGroups.length} groups of friends!`)

  console.log('------------------------------------------')
  await conn.close()
}

run()
