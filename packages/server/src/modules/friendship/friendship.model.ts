import { Column, Entity } from 'typeorm'

import { EntityWithOwner } from '@/modules/exented-entity'
import { User } from '@/modules/user/user.model'
import { isNil, OptionalUuid } from '@/utils'

type FriendshipConstructor = OptionalUuid<
  Pick<Friendship, 'uuid' | 'initiatorUuid' | 'receiverUuid'>
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
  public async receiver(): Promise<User> {
    const receiver = await User.findOne({ uuid: this.receiverUuid })

    if (isNil(receiver)) {
      throw this.shouldExistError(User, this.receiverUuid)
    }

    return receiver
  }

  constructor(options: FriendshipConstructor) {
    super(options)

    this.initiatorUuid = options?.initiatorUuid
    this.receiverUuid = options?.receiverUuid
  }

  public async getOwner() {
    return this.initiator()
  }
}
