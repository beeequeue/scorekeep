import { Column, Entity } from 'typeorm'
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'

import { EntityWithOwner } from '@/modules/exented-entity'
import { User } from '@/modules/user/user.model'
import { isNil, PartialPick } from '@/utils'

export enum ConnectionService {
  GOOGLE = 'GOOGLE',
}

export type ConnectionConstructor = PartialPick<
  Connection,
  'uuid' | 'createdAt'
> &
  Pick<
    Connection,
    'type' | 'userUuid' | 'name' | 'serviceId' | 'email' | 'image'
  >

registerEnumType(ConnectionService, {
  name: 'ConnectionService',
})

@Entity()
@ObjectType()
export class Connection extends EntityWithOwner {
  @Column()
  @Field(() => ConnectionService)
  public type: ConnectionService

  @Column({ type: 'uuid' })
  public userUuid: string
  @Field(() => User)
  public async user(): Promise<User> {
    const user = await User.findOne({ uuid: this.userUuid })

    if (isNil(user)) {
      throw this.shouldExistError(User, this.userUuid)
    }

    return user
  }

  @Column()
  @Field(() => ID)
  public serviceId: string

  @Column()
  @Field()
  public name: string

  @Column()
  @Field()
  public email: string

  @Column()
  @Field()
  public image: string

  constructor(options: ConnectionConstructor) {
    super(options)

    this.type = options?.type
    this.userUuid = options?.userUuid
    this.serviceId = options?.serviceId
    this.name = options?.name
    this.email = options?.email
    this.image = options?.image
    this.createdAt = options?.createdAt!
  }

  public async getOwners() {
    return [await this.user()]
  }
}
