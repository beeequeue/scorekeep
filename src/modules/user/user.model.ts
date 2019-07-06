import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'

enum UserType {
  SIMPLE = 'SIMPLE',
  FULL = 'FULL',
}

registerEnumType(UserType, { name: 'UserType' })

type UserConstructor = Pick<
  User,
  'uuid' | 'name' | 'mainConnectionUuid'
>

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  public uuid!: string

  @Column({ length: 50 })
  @Field()
  public name!: string

  @Field(() => UserType)
  public type(): UserType {
    // Check if has connections
    return UserType.SIMPLE
  }

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
