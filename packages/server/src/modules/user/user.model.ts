import { Column, Entity } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { MaxLength } from 'class-validator'

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
  @Column()
  @Field()
  @MaxLength(50)
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

    this.name = options?.name
    this.mainConnectionUuid = options?.mainConnectionUuid
  }

  public async getMainConnection(): Promise<Connection | null> {
    if (isNil(this.mainConnectionUuid)) return null

    return (await Connection.findOne({ uuid: this.mainConnectionUuid })) ?? null
  }

  public async connectTo(options: Omit<ConnectionConstructor, 'userUuid'>) {
    const connection = await new Connection({
      ...options,
      userUuid: this.uuid,
    }).save()

    if (isNil(this.mainConnectionUuid)) {
      this.mainConnectionUuid = connection.uuid
      await this.save()
    }

    return connection
  }
}
