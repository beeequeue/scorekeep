import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { User } from '@/modules/user/user.model'
import { isNil } from '@/utils'

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
  @Field(() => User, {
    description: 'A club owner must be a claimed player',
  })
  public async owner(): Promise<User> {
    const owner = await User.findOne({ where: { uuid: this.ownerUuid } })

    if (isNil(owner)) {
      throw new Error(
        `Club:${this.uuid} owner (User:${this.ownerUuid}) does not exist!`,
      )
    }

    return owner
  }

  public static from(parameters: ClubConstructor) {
    const club = new Club()

    return Object.assign(club, parameters)
  }
}
