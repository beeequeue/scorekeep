import { Column, Entity, IsNull } from 'typeorm'
import { Authorized, Ctx, Field, ObjectType } from 'type-graphql'

import { UserBase } from '@/modules/user/user-base.model'
import { Club } from '@/modules/club/club.model'
import {
  Connection,
  ConnectionConstructor,
} from '@/modules/connection/connection.model'
import {
  FriendRequest,
  Friendship,
} from '@/modules/friendship/friendship.model'
import { isNil, OptionalUuid } from '@/utils'
import { SessionContext } from '@/modules/session/session.lib'

type UserConstructor = OptionalUuid<
  Pick<User, 'uuid' | 'name' | 'mainConnectionUuid'>
>

@Entity()
@ObjectType()
export class User extends UserBase {
  @Field(() => [Club])
  public async clubs(): Promise<Club[]> {
    throw new Error('Not implemented yet')
  }

  @Field(() => [Connection])
  public async connections(): Promise<Connection[]> {
    return await Connection.find({ userUuid: this.uuid })
  }

  @Column({ type: 'uuid', nullable: true })
  public mainConnectionUuid: string | null
  @Field(() => Connection, { nullable: true })
  public async mainConnection(): Promise<Connection | null> {
    if (isNil(this.mainConnectionUuid)) return null

    return await Connection.findOneOrFail({ uuid: this.mainConnectionUuid })
  }

  @Field(() => Date)
  @Authorized()
  public async friendsSince(
    @Ctx() context: SessionContext,
  ): Promise<Date | null> {
    const { uuid } = context.session!.user
    const friendship = await Friendship.findOne({
      where: [{ initiatorUuid: uuid }, { receiverUuid: uuid }],
    })

    return friendship?.accepted ?? null
  }

  @Field(() => [FriendRequest])
  public async friendRequests(): Promise<FriendRequest[]> {
    const friendships = await Friendship.find({
      where: [
        { initiatorUuid: this.uuid, accepted: IsNull() },
        { receiverUuid: this.uuid, accepted: IsNull() },
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

  constructor(options: UserConstructor) {
    super(options)

    this.name = options?.name
    this.mainConnectionUuid = options?.mainConnectionUuid
  }

  public async connectTo(options: Omit<ConnectionConstructor, 'userUuid'>) {
    const connection = await new Connection({
      ...options,
      userUuid: this.uuid,
    }).save()

    if (isNil(this.mainConnectionUuid)) {
      this.mainConnectionUuid = connection.uuid
      await this.save()
    }

    return connection
  }

  public async requestFriendship(initiatorUuid: string) {
    const friendship = new Friendship({
      initiatorUuid,
      receiverUuid: this.uuid,
    })

    await friendship.save()
  }
}
