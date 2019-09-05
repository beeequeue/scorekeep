import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
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

  // Text is going to be a comma separated uuids
  @Column({ type: 'text' })
  public playerUuids!: string[]
  @Field(() => [User])
  public players!: User[]

  @Column({ type: 'uuid' })
  public gameUuid!: string
  @Field(() => Boardgame)
  public game!: Boardgame

  // Text is going to be a comma separated uuids
  @Column({ type: 'text' })
  public winnerUuids!: string[]
  @Field(() => [User])
  public winners!: User[]

  @Column({ type: 'json' })
  @Field(() => JSON)
  public results!: number

  @Column({ type: 'timestamp' })
  @Field(() => Date)
  public date!: Date

  public static from(parameters: MatchConstructor) {
    const match = new Match()

    // TODO: Filter keys haha
    return Object.assign(match, parameters)
  }
}
