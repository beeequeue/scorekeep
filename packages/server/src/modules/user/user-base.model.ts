import { Column } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { MaxLength } from 'class-validator'

import { ExtendedEntity } from '@/modules/exented-entity'
import { User } from '@/modules/user/user.model'
import { UnclaimedUser } from '@/modules/user/unclaimed-user.model'

@ObjectType({ isAbstract: true })
export abstract class UserBase extends ExtendedEntity {
  @Column()
  @Field()
  @MaxLength(50)
  public name!: string

  public abstract friends(): Promise<Array<User | UnclaimedUser>>
}
