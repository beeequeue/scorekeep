import { Column, Entity } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

import { UserBase } from '@/modules/user/user-base.model'
import { Club } from '@/modules/club/club.model'
import {
  Connection,
  ConnectionConstructor,
} from '@/modules/connection/connection.model'
import { Friendship } from '@/modules/friendship/friendship.model'
import { isNil, PartialPick } from '@/utils'

type UserConstructor = PartialPick<User, 'uuid' | 'createdAt'> &
  Pick<User, 'name' | 'mainConnectionUuid'>

@Entity()
@ObjectType()
export class User extends UserBase {
  @Field(() => [Club])
  public async clubs(): Promise<Club[]> {
    throw new Error('Not implemented yet')
  }

  @Field(() => [Connection])
  public async connections(): Promise<Connection[]> {
    return await Connection.find({ userUuid: this.uuid })
  }

  @Column({ type: 'uuid', nullable: true })
  public mainConnectionUuid: string | null
  @Field(() => Connection, { nullable: true })
  public async mainConnection(): Promise<Connection | null> {
    if (isNil(this.mainConnectionUuid)) return null

    return await Connection.findOneOrFail({ uuid: this.mainConnectionUuid })
  }

  constructor(options: UserConstructor) {
    super(options)

    this.name = options?.name
    this.mainConnectionUuid = options?.mainConnectionUuid
    this.createdAt = options?.createdAt!
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

  public async requestFriendship(initiatorUuid: string) {
    const friendship = new Friendship({
      initiatorUuid,
      receiverUuid: this.uuid,
    })

    await friendship.save()
  }

  public async getOwners() {
    return [this]
  }
}
