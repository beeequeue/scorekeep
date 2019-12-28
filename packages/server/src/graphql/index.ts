import { resolve } from 'path'
import { buildSchema } from 'type-graphql'
import { BoardgameResolver } from '@/modules/boardgame/boardgame.resolvers'
import { ClubResolver } from '@/modules/club/club.resolvers'
import { ConnectionResolver } from '@/modules/connection/connection.resolvers'
import { FriendshipResolver } from '@/modules/friendship/friendship.resolvers'
import { MatchResolver } from '@/modules/match/match.resolvers'
import { UserResolver } from '@/modules/user/user.resolvers'
import { authChecker } from '@/graphql/auth'

export const createSchema = async (generateSnapshot = true) =>
  buildSchema({
    emitSchemaFile:
      !generateSnapshot || process.env.NODE_ENV === 'test'
        ? false
        : { path: resolve(__dirname, 'snapshot.graphql') },
    dateScalarMode: 'isoDate',
    resolvers: [
      BoardgameResolver,
      ClubResolver,
      ConnectionResolver,
      FriendshipResolver,
      MatchResolver,
      UserResolver,
    ],
    authChecker,
  })
