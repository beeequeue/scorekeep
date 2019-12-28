import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from 'type-graphql'

import { SessionContext } from '@/modules/session/session.lib'
import { User } from '@/modules/user/user.model'
import { isNil } from '@/utils'
import { Friendship } from '@/modules/friendship/friendship.model'

@Resolver()
export class FriendshipResolver {
  @Mutation(() => User)
  @Authorized()
  public async addFriend(
    @Ctx() context: SessionContext,
    @Arg('uuid', () => ID) uuid: string,
  ): Promise<User> {
    const user = await User.findOne({ uuid })

    if (isNil(user)) {
      throw new Error('Could not find user!')
    }

    await user.requestFriendship(context.session!.user.uuid)

    return context.session!.user
  }

  @Mutation(() => User)
  @Authorized()
  public async acceptFriendship(
    @Ctx() context: SessionContext,
    @Arg('userUuid', () => ID) userUuid: string,
  ): Promise<User> {
    const user = await Friendship.findOne({ initiatorUuid: userUuid })

    if (isNil(user)) {
      throw new Error('Could not find user!')
    }

    user.accepted = new Date()
    await user.save()

    return context.session!.user
  }
}
