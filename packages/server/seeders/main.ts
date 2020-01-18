/* eslint-disable no-console */
import faker from 'faker'
import { addDays } from 'date-fns'

import { connectToDatabase } from '@/db'
import { Boardgame } from '@/modules/boardgame/boardgame.model'
import { Friendship } from '@/modules/friendship/friendship.model'
import { Match } from '@/modules/match/match.model'
import { User } from '@/modules/user/user.model'
import { generateUser } from '@/utils/tests'
import { GAMES } from '@/utils/test-data'
import { randomItem } from '@/utils'

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

const FIRST_DATE = addDays(new Date(), -90)
const eras = [
  FIRST_DATE,
  addDays(FIRST_DATE, 14),
  addDays(FIRST_DATE, 21),
] as const

// Board games with (mock) in the name don't have a unique result schema
const insertBoardgames = async () =>
  Promise.all([
    new Boardgame({
      ...GAMES.scythe.boardgame,
      createdAt: faker.date.between(eras[0], eras[1]),
    }).save(),
    new Boardgame({
      ...GAMES.azul.boardgame,
      createdAt: faker.date.between(eras[0], eras[1]),
    }).save(),
    new Boardgame({
      ...GAMES.mars.boardgame,
      createdAt: faker.date.between(eras[0], eras[1]),
    }).save(),
    new Boardgame({
      ...GAMES.gloomhaven.boardgame,
      createdAt: faker.date.between(eras[0], eras[1]),
    }).save(),
    new Boardgame({
      ...GAMES.wingspan.boardgame,
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

const insertMatches = async (groups: User[][], games: Boardgame[]): Promise<Match[]> => {
  const daysLeft = 90 - 21
  const twos = Math.floor(daysLeft / 2)

  const promises = groups.map(users =>
    Array.from({ length: twos }).map(() => {
      const game =
        Math.random() > 0.5
          ? randomItem([games[0], games[1]])
          : randomItem(games)

      const results =
        game.shortName === GAMES.scythe.boardgame.shortName
          ? GAMES.scythe.generateResult(users)
          : GAMES.azul.generateResult(users)
      const winnerUuids = results
        .filter(result => result.winner)
        .map(result => result.player)

      return new Match({
        playerUuids: users.map(u => u.uuid),
        winnerUuids,
        gameUuid: game.uuid,
        results,
        metadata: null,
        date: faker.date.between(eras[2], new Date()),
      }).save()
    }),
  )

  return Promise.all(promises.flat())
}

const run = async () => {
  const conn = await connectToDatabase()

  const boardgames = await insertBoardgames()
  console.log('------------------------------------------')
  console.log(`Inserted ${boardgames.length} board games!`)
  console.log(boardgames.map(game => game.name).join(', '))

  const userDatas = await insertUsers()
  const users = userDatas.map(d => d.user)
  console.log('------------------------------------------')
  console.log(`Inserted ${users.length} users!`)

  const friendGroups = await createFriendGroups(users)
  console.log('------------------------------------------')
  console.log(`Created ${friendGroups.length} groups of friends!`)

  const matches = await insertMatches(friendGroups, boardgames)
  console.log('------------------------------------------')
  console.log(`Created ${matches.length} matches!`)

  console.log('------------------------------------------')
  await conn.close()
}

run()
