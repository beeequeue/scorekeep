import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'
import uuid from 'uuid/v4'
import { isNil } from '@/utils'

export enum ConnectionService {
  GOOGLE = 'GOOGLE',
}

type ConnectionConstructor = Pick<
  Connection,
  'type' | 'userUuid' | 'serviceId' | 'email' | 'image'
>

registerEnumType(ConnectionService, {
  name: 'ConnectionService',
})

@Entity()
@ObjectType()
export class Connection extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  public uuid: string

  @Column({ type: 'uuid' })
  @Field(() => ID)
  public userUuid: string

  @Column()
  @Field(() => ConnectionService)
  public type: ConnectionService

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
    super()

    if (isNil(options)) options = {} as any

    this.uuid = uuid()
    this.userUuid = options.userUuid
    this.type = options.type
    this.serviceId = options.serviceId
    this.email = options.email
    this.image = options.image
  }
}
