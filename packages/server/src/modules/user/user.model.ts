import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import uuid from 'uuid/v4'

import { Club } from '@/modules/club/club.model'
import { Connection } from '@/modules/connection/connection.model'
import { isNil } from '@/utils'

type UserConstructor = Partial<Pick<User, 'uuid'>> &
  Pick<User, 'name' | 'mainConnectionUuid'>

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  public uuid: string

  @Column({ length: 50 })
  @Field()
  public name: string

  @Field(() => [Club])
  public async clubs(): Promise<Club[]> {
    throw new Error('Not implemented yet')
  }

  @Field(() => [Connection])
  public async connections(): Promise<Connection[]> {
    return await Connection.find({ where: { userUuid: this.uuid } })
  }

  @Column({ type: 'uuid', nullable: true })
  @Field(() => ID, { nullable: true })
  public mainConnectionUuid!: string | null

  constructor(options: UserConstructor) {
    super()

    if (isNil(options)) options = {} as any

    this.uuid = options.uuid || uuid()
    this.name = options.name
  }

  public static async findByUuid(uuid: string): Promise<User | null> {
    const user = await User.findOne({ where: { uuid } })

    return user || null
  }
}
