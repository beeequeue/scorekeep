import { Entity, IsNull, Not } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

import { Friendship } from '@/modules/friendship/friendship.model'
import { UserBase } from '@/modules/user/user-base.model'
import { User } from '@/modules/user/user.model'
import { OptionalUuid } from '@/utils'

type UserConstructor = OptionalUuid<Pick<UserBase, 'uuid' | 'name'>>

@Entity()
@ObjectType()
export class UnclaimedUser extends UserBase {
  constructor(options: UserConstructor) {
    super(options)

    this.name = options?.name
  }

  @Field(() => [User])
  public async friends(): Promise<User[]> {
    const friendships = await Friendship.find({
      where: [
        { initiatorUuid: this.uuid, accepted: Not(IsNull()) },
        { receiverUuid: this.uuid, accepted: Not(IsNull()) },
      ],
    })

    return Promise.all(friendships.map(f => f.initiator()))
  }
}
