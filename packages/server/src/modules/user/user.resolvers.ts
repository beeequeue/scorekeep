import { Arg, ID, Query, Resolver } from 'type-graphql'
import uuid from 'uuid/v4'

import { User } from '@/modules/user/user.model'

@Resolver()
export class UserResolver {
  @Query(() => User)
  public user(@Arg('uuid', () => ID) uuid: string): User {
    return User.from({
      uuid,
      name: 'Someone else',
    })
  }

  @Query(() => User)
  public viewer(): User {
    return User.from({
      uuid: uuid(),
      name: 'You',
    })
  }
}
