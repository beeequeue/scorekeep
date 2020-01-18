import { Boardgame, GAME_TYPE } from '@/modules/boardgame/boardgame.model'
import faker from 'faker'

faker.seed(12)

const defaultSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#' as const,
  type: 'object' as const,
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
}

const defaultResultGenerator = (users: Array<{ uuid: string }>) => {
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
}

export const GAMES = {
  azul: {
    boardgame: new Boardgame({
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
      resultsSchema: defaultSchema,
    }),
    generateResult: defaultResultGenerator,
  },
  scythe: {
    boardgame: new Boardgame({
      type: GAME_TYPE.COMPETITIVE,
      name: 'Scythe',
      shortName: 'scythe',
      aliases: ['Серп', '大鎌戦役', '鐮刀戰爭', '사이쓰'],
      thumbnail:
        'https://cf.geekdo-images.com/itemrep/img/bhemoxL7PG1a_79L0D9syPTADSY=/fit-in/246x300/pic3536616.jpg',
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
  mars: {
    boardgame: new Boardgame({
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
      resultsSchema: defaultSchema,
    }),
    generateResult: defaultResultGenerator,
  },
  gloomhaven: {
    boardgame: new Boardgame({
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
      resultsSchema: defaultSchema,
    }),
    generateResult: defaultResultGenerator,
  },
  wingspan: {
    boardgame: new Boardgame({
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
      resultsSchema: defaultSchema,
    }),
    generateResult: defaultResultGenerator,
  },
  wonders: {
    boardgame: new Boardgame({
      type: GAME_TYPE.COMPETITIVE,
      name: '7 Wonders (mock)',
      shortName: '7-wonders',
      aliases: [],
      thumbnail:
        'https://cf.geekdo-images.com/itemrep/img/fR5_q-7pMDmhLP8SPLOwPcUeLVo=/fit-in/246x300/pic860217.jpg',
      url: 'https://boardgamegeek.com/boardgame/68448/7-wonders',
      rulebook: null,
      minPlayers: 2,
      maxPlayers: 7,
      resultsSchema: defaultSchema,
    }),
    generateResult: defaultResultGenerator,
  },
} as const

export const getTestBoardgames = () =>
  Object.keys(GAMES).map(key => GAMES[key as keyof typeof GAMES].boardgame)
