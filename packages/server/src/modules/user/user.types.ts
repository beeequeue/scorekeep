import { createUnionType } from 'type-graphql'
import { User } from '@/modules/user/user.model'
import { UnclaimedUser } from '@/modules/user/unclaimed-user.model'

export const UsersUnionType = createUnionType({
  name: 'UsersUnion',
  types: () => [User, UnclaimedUser],
})

