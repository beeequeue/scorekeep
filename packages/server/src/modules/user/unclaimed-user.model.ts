import { Entity } from 'typeorm'
import { ObjectType } from 'type-graphql'
import { OptionalUuid } from '@/utils'
import { UserBase } from '@/modules/user/user-base.model'

type UserConstructor = OptionalUuid<Pick<UserBase, 'uuid' | 'name'>>

@Entity()
@ObjectType()
export class UnclaimedUser extends UserBase {
  constructor(options: UserConstructor) {
    super(options)

    this.name = options?.name
  }
}
