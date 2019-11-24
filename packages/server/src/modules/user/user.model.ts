import { Column, Entity } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'

import { ExtendedEntity } from '@/modules/exented-entity'
import { Club } from '@/modules/club/club.model'
import {
  Connection,
  ConnectionConstructor,
} from '@/modules/connection/connection.model'
import { isNil, OptionalUuid } from '@/utils'

type UserConstructor = OptionalUuid<
  Pick<User, 'uuid' | 'name' | 'mainConnectionUuid'>
>

@Entity()
@ObjectType()
export class User extends ExtendedEntity {
  @Column({ length: 50 })
  @Field()
  public name: string

  @Field(() => [Club])
  public async clubs(): Promise<Club[]> {
    throw new Error('Not implemented yet')
  }

  @Field(() => [Connection])
  public async connections(): Promise<Connection[]> {
    return await Connection.find({ userUuid: this.uuid })
  }

  @Column({ type: 'uuid', nullable: true })
  @Field(() => ID, { nullable: true })
  public mainConnectionUuid: string | null

  constructor(options: UserConstructor) {
    super(options)

    if (isNil(options)) options = {} as any

    this.name = options.name
    this.mainConnectionUuid = options.mainConnectionUuid
  }

  public async connectTo(options: Omit<ConnectionConstructor, 'userUuid'>) {
    const connection = await new Connection({
      uuid: options.uuid,
      type: options.type,
      userUuid: this.uuid,
      email: options.email,
      serviceId: options.serviceId,
      image: options.image,
    }).save()

    this.mainConnectionUuid = this.mainConnectionUuid ?? connection.uuid
    return this.save()
  }
}
