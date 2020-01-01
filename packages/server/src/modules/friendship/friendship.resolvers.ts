import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Resolver,
  Root,
} from 'type-graphql'

import { SessionContext } from '@/modules/session/session.lib'
import {
  FriendRequest,
  Friendship,
} from '@/modules/friendship/friendship.model'
import { User } from '@/modules/user/user.model'
import { UnclaimedUser } from '@/modules/user/unclaimed-user.model'
import { isNil } from '@/utils'
import { UsersUnionType } from '@/modules/user/user.types'
import { IsNull, Not } from 'typeorm'

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
      throw new Error('Could not find User!')
    }

    await user.requestFriendship(context.session!.user.uuid)

    return context.session!.user
  }

  @Mutation(() => User)
  @Authorized()
  public async acceptFriendRequest(
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

@Resolver(() => User)
export class FriendshipUserResolver {
  @FieldResolver(() => [UsersUnionType])
  public async friends(
    @Root() user: User,
  ): Promise<Array<typeof UsersUnionType>> {
    const friendships = await Friendship.find({
      where: [
        { initiatorUuid: user.uuid, accepted: Not(IsNull()) },
        { receiverUuid: user.uuid, accepted: Not(IsNull()) },
      ],
      order: {
        updatedAt: 'ASC',
      },
    })

    return Promise.all(
      friendships.map(f =>
        f.initiatorUuid === user.uuid ? f.receiver() : f.initiator(),
      ),
    )
  }

  @FieldResolver(() => Date, { nullable: true })
  public async friendsSince(
    @Ctx() context: SessionContext,
  ): Promise<Date | null> {
    if (isNil(context.session)) return null

    const { uuid } = context.session.user
    const friendship = await Friendship.findOne({
      where: [{ initiatorUuid: uuid }, { receiverUuid: uuid }],
    })

    return friendship?.accepted ?? null
  }

  @FieldResolver(() => [FriendRequest])
  public async friendRequests(@Root() user: User): Promise<FriendRequest[]> {
    const friendships = await Friendship.find({
      where: [
        { initiatorUuid: user.uuid, accepted: IsNull() },
        { receiverUuid: user.uuid, accepted: IsNull() },
      ],
      order: {
        accepted: 'DESC',
      },
    })

    return Promise.all(
      friendships.map(
        async f =>
          new FriendRequest({
            uuid: f.uuid,
            initiator: await f.initiator(),
            receiver: await f.receiver(),
          }),
      ),
    )
  }
}

@Resolver(() => UnclaimedUser)
export class FriendshipUnclaimedUserResolver {
  @FieldResolver(() => [User])
  public async friends(@Root() user: User): Promise<User[]> {
    const friendships = await Friendship.find({
      where: [
        { initiatorUuid: user.uuid, accepted: Not(IsNull()) },
        { receiverUuid: user.uuid, accepted: Not(IsNull()) },
      ],
      order: {
        updatedAt: 'ASC',
      },
    })

    return Promise.all(friendships.map(f => f.initiator()))
  }

  @FieldResolver(() => Date, { nullable: true })
  public async friendsSince(
    @Ctx() context: SessionContext,
  ): Promise<Date | null> {
    if (isNil(context.session)) return null

    const { uuid } = context.session.user
    const friendship = await Friendship.findOne({
      where: [{ initiatorUuid: uuid }],
    })

    return friendship?.accepted ?? null
  }
}
