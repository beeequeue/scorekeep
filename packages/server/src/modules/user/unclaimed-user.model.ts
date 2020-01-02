import { Entity } from 'typeorm'
import { ObjectType } from 'type-graphql'
import { UserBase } from '@/modules/user/user-base.model'
import { Friendship } from '@/modules/friendship/friendship.model'
import { isNil, OptionalUuid } from '@/utils'

type UserConstructor = OptionalUuid<Pick<UserBase, 'uuid' | 'name'>>

@Entity()
@ObjectType()
export class UnclaimedUser extends UserBase {
  constructor(options: UserConstructor) {
    super(options)

    this.name = options?.name
  }

  public async getOwners() {
    const friendship = await Friendship.findOne(
      { receiverUuid: this.uuid },
      { order: { createdAt: 'DESC' } },
    )

    const arr: UserBase[] = [this]

    if (!isNil(friendship)) {
      arr.push(await friendship.initiator())
    }

    return arr
  }
}
