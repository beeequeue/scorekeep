import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { User } from '@/modules/user/user.model'

type ClubConstructor = Pick<Club, 'uuid' | 'name' | 'ownerUuid'>

@Entity()
@ObjectType()
export class Club extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  public uuid!: string

  @Column({ length: 50 })
  @Field()
  public name!: string

  @Field(() => [User])
  public members!: User[]

  @Column({ type: 'uuid' })
  public ownerUuid!: string
  @Field(() => User)
  public owner!: User

  public static from(parameters: ClubConstructor) {
    const club = new Club()

    return Object.assign(club, parameters)
  }
}
