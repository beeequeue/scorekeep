import { Column, Entity, Not } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

import { UserBase } from '@/modules/user/user-base.model'
import { Club } from '@/modules/club/club.model'
import {
  Connection,
  ConnectionConstructor,
} from '@/modules/connection/connection.model'
import { Friendship } from '@/modules/friendship/friendship.model'
import { isNil, OptionalUuid } from '@/utils'

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

  @Field(() => [User])
  public async friends(): Promise<User[]> {
    const friendships = await Friendship.find({
      where: [
        { initiatorUuid: this.uuid, accepted: Not(null) },
        { receiverUuid: this.uuid, accepted: Not(null) },
      ],
    })

    return Promise.all(
      friendships.map(f =>
        f.initiatorUuid === this.uuid ? f.receiver() : f.initiator(),
      ),
    )
  }

  @Field(() => [User])
  public async friendRequests(): Promise<User[]> {
    const friendships = await Friendship.find({
      where: [
        { initiatorUuid: this.uuid, accepted: null },
        { receiverUuid: this.uuid, accepted: null },
      ],
    })

    return Promise.all(
      friendships.map(f =>
        f.initiatorUuid === this.uuid ? f.receiver() : f.initiator(),
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
