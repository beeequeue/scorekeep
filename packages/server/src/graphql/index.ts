import { buildSchema } from 'type-graphql'

import { UserResolver } from '@/modules/user/user.resolvers'
import { BoardgameResolver } from '@/modules/boardgame/boardgame.resolvers'

export const createSchema = async () =>
  buildSchema({
    dateScalarMode: 'isoDate',
    resolvers: [BoardgameResolver, UserResolver],
  })
