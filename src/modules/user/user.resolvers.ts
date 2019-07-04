import { Arg, ID, Query, Resolver } from 'type-graphql'

import { User } from '@/modules/user/user.model'

@Resolver()
export class UserResolver {
  @Query(() => User)
  public async user(@Arg('id', () => ID) id: string): Promise<User> {
    return new User({
      id,
      name: 'Someone else',
    })
  }

  @Query(() => User)
  public async viewer(): Promise<User> {
    return new User({
      id: '7ny9234nt7y9p23v7ny9p2',
      name: 'You',
    })
  }
}
