import { buildSchema } from 'type-graphql'

import { UserResolver } from '@/modules/user/user.resolvers'

export const createSchema = async () =>
  buildSchema({
    dateScalarMode: 'isoDate',
    resolvers: [UserResolver],
  })
