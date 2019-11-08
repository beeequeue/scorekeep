import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { Club } from '@/modules/club/club.model'
import { Connection } from '@/modules/connection/connection.model'

type UserConstructor = Pick<User, 'uuid' | 'name' | 'mainConnectionUuid'>

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  public uuid!: string

  @Column({ length: 50 })
  @Field()
  public name!: string

  @Field(() => [Club])
  public clubs!: Club[]

  @Field(() => [Connection])
  public async connections(): Promise<Connection[]> {
    return await Connection.find({ where: { userUuid: this.uuid } })
  }

  @Column({ type: 'uuid', nullable: true })
  @Field(() => ID, { nullable: true })
  public mainConnectionUuid!: string | null

  public static async findByUuid(uuid: string): Promise<User | null> {
    const user = await User.findOne({ where: { uuid } })

    return user || null
  }

  public static from(parameters: UserConstructor) {
    const user = new User()

    // TODO: Filter keys haha
    return Object.assign(user, parameters)
  }
}
