import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'

interface UserConstructor {
  uuid: string
  name: string
  mainConnectionUuid?: string
}

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  public uuid!: string

  @Column({ length: 50 })
  @Field()
  public name!: string

  @Column({ type: 'uuid' })
  @Field(() => ID, { nullable: true })
  public mainConnectionUuid?: string

  public static async from({
    uuid,
    name,
    mainConnectionUuid,
  }: UserConstructor) {
    const user = new User()

    user.uuid = uuid
    user.name = name
    user.mainConnectionUuid = mainConnectionUuid

    return user
  }
}
