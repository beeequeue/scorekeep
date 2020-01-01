import { Column } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { MaxLength } from 'class-validator'

import { ExtendedEntity } from '@/modules/exented-entity'

@ObjectType({ isAbstract: true })
export abstract class UserBase extends ExtendedEntity {
  @Column()
  @Field()
  @MaxLength(50)
  public name!: string

  public abstract friendsSince(...any: any[]): Promise<Date | null>
}
