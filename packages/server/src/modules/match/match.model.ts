import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import { User } from '@/modules/user/user.model'
import { Boardgame } from '@/modules/boardgame/boardgame.model'
import { Club } from '@/modules/club/club.model'

type MatchConstructor = Pick<
  Match,
  | 'uuid'
  | 'clubUuid'
  | 'playerUuids'
  | 'winnerUuids'
  | 'gameUuid'
  | 'results'
  | 'date'
>

@Entity()
@ObjectType()
export class Match extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  public uuid!: string

  @Column({ type: 'uuid' })
  public clubUuid!: string
  @Field(() => Club)
  public club!: Club

  @Column({ type: 'simple-array' })
  public playerUuids!: string[]
  @Field(() => [User])
  public async players(): Promise<User[]> {
    return User.find({ where: this.playerUuids.map(uuid => ({ uuid })) })
  }

  @Column({ type: 'simple-array' })
  public winnerUuids!: string[]
  @Field(() => [User])
  public async winners(): Promise<User[]> {
    return User.find({ where: this.winnerUuids.map(uuid => ({ uuid })) })
  }

  @Column({ type: 'uuid' })
  public gameUuid!: string
  @Field(() => Boardgame)
  public game!: Boardgame

  @Column({ type: 'json' })
  @Field(() => GraphQLJSONObject)
  public results!: object

  @Column({ type: 'timestamp' })
  @Field(() => Date)
  public date!: Date

  public static from(parameters: MatchConstructor) {
    const match = new Match()

    // TODO: Filter keys haha
    return Object.assign(match, parameters)
  }
}
