import { Column, Entity } from 'typeorm'
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'

import { ExtendedEntity } from '@/modules/exented-entity'
import { User } from '@/modules/user/user.model'
import { isNil, OptionalUuid } from '@/utils'

export enum ConnectionService {
  GOOGLE = 'GOOGLE',
}

export type ConnectionConstructor = OptionalUuid<
  Pick<
    Connection,
    'uuid' | 'type' | 'userUuid' | 'serviceId' | 'email' | 'image'
  >
>

registerEnumType(ConnectionService, {
  name: 'ConnectionService',
})

@Entity()
@ObjectType()
export class Connection extends ExtendedEntity {
  @Column()
  @Field(() => ConnectionService)
  public type: ConnectionService

  @Column({ type: 'uuid' })
  public userUuid: string
  @Field(() => User)
  public async user(): Promise<User> {
    const user = await User.findByUuid(this.userUuid)

    if (isNil(user)) {
      throw new Error(
        `${this.toLoggable()}'s connected ${User.toLoggable(
          this.userUuid,
        )} does not exist!`,
      )
    }

    return user
  }

  @Column()
  @Field(() => ID)
  public serviceId: string

  @Column()
  @Field()
  public email: string

  @Column()
  @Field()
  public image: string

  constructor(options: ConnectionConstructor) {
    super(options)

    if (isNil(options)) options = {} as any

    this.type = options.type
    this.userUuid = options.userUuid
    this.serviceId = options.serviceId
    this.email = options.email
    this.image = options.image
  }
}
