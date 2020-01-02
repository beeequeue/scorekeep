import { Column } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { MaxLength } from 'class-validator'

import { EntityWithOwner } from '@/modules/exented-entity'

@ObjectType({ isAbstract: true })
export abstract class UserBase extends EntityWithOwner {
  @Column()
  @Field()
  @MaxLength(50)
  public name!: string
}
