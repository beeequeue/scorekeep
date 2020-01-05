import { Column, Entity } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'

import { EntityWithOwner } from '@/modules/exented-entity'
import { User } from '@/modules/user/user.model'
import { UnclaimedUser } from '@/modules/user/unclaimed-user.model'
import { UsersUnionType } from '@/modules/user/user.types'
import { isNil, OptionalUuid } from '@/utils'

type FriendshipConstructor = OptionalUuid<
  Pick<Friendship, 'uuid' | 'initiatorUuid' | 'receiverUuid'> &
    Partial<Pick<Friendship, 'accepted'>>
>

@Entity()
export class Friendship extends EntityWithOwner {
  @Column({ type: 'uuid' })
  public initiatorUuid: string
  public async initiator(): Promise<User> {
    const initiator = await User.findOne({ uuid: this.initiatorUuid })

    if (isNil(initiator)) {
      throw this.shouldExistError(User, this.initiatorUuid)
    }

    return initiator
  }

  @Column({ type: 'uuid' })
  public receiverUuid: string
  public async receiver(): Promise<User | UnclaimedUser> {
    const receiver =
      (await User.findOne({ uuid: this.receiverUuid })) ??
      (await UnclaimedUser.findOne({ uuid: this.receiverUuid }))

    if (isNil(receiver)) {
      throw this.shouldExistError(User, this.receiverUuid)
    }

    return receiver
  }

  @Column({ type: 'timestamp', nullable: true })
  public accepted: Date | null

  constructor(options: FriendshipConstructor) {
    super(options)

    this.initiatorUuid = options?.initiatorUuid
    this.receiverUuid = options?.receiverUuid
    this.accepted = options?.accepted ?? null
  }

  public async getOwners() {
    return [await this.initiator(), await this.receiver()]
  }
}

@ObjectType()
export class FriendRequest {
  @Field(() => ID)
  public uuid: string

  @Field(() => User)
  public initiator: User

  @Field(() => UsersUnionType)
  public receiver: User | UnclaimedUser

  constructor(options: {
    uuid: string
    initiator: FriendRequest['initiator']
    receiver: FriendRequest['receiver']
  }) {
    this.uuid = options.uuid
    this.initiator = options.initiator
    this.receiver = options.receiver
  }
}
