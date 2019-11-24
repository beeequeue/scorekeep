import { resolve } from 'path'
import { buildSchema } from 'type-graphql'

import { BoardgameResolver } from '@/modules/boardgame/boardgame.resolvers'
import { ClubResolver } from '@/modules/club/club.resolvers'
import { MatchResolver } from '@/modules/match/match.resolvers'
import { UserResolver } from '@/modules/user/user.resolvers'

export const createSchema = async (generateSnapshot = true) =>
  buildSchema({
    emitSchemaFile: !generateSnapshot
      ? false
      : { path: resolve(__dirname, 'snapshot.graphql') },
    dateScalarMode: 'isoDate',
    resolvers: [BoardgameResolver, ClubResolver, MatchResolver, UserResolver],
  })
