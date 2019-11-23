import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import uuid from 'uuid/v4'

import { User } from '@/modules/user/user.model'
import { isNil, OptionalUuid } from '@/utils'

type ClubConstructor = OptionalUuid<
  Pick<Club, 'uuid' | 'name' | 'memberUuids' | 'ownerUuid'>
>

@Entity()
@ObjectType()
export class Club extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  public readonly uuid: string

  @Column({ length: 50 })
  @Field()
  public name: string

  @Column({ type: 'simple-array' })
  public memberUuids: string[]
  @Field(() => [User])
  public async members(): Promise<User[]> {
    return User.find({
      where: this.memberUuids.map(memberUuid => ({
        uuid: memberUuid,
      })),
    })
  }

  @Column({ type: 'uuid' })
  public ownerUuid: string
  @Field(() => User, {
    description: 'A club owner must be a claimed player',
  })
  public async owner(): Promise<User> {
    const owner = await User.findOne({ where: { uuid: this.ownerUuid } })

    if (isNil(owner)) {
      throw new Error(
        `Club:${this.uuid} owner (User:${this.ownerUuid}) does not exist!`,
      )
    }

    return owner
  }

  constructor(options: ClubConstructor) {
    super()

    if (isNil(options)) options = {} as any

    this.uuid = options.uuid || uuid()
    this.name = options.name
    this.memberUuids = options.memberUuids
    this.ownerUuid = options.ownerUuid
  }
}
