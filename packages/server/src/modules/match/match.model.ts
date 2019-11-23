import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import uuid from 'uuid/v4'

import { User } from '@/modules/user/user.model'
import { Boardgame } from '@/modules/boardgame/boardgame.model'
import { Club } from '@/modules/club/club.model'
import { isNil, OptionalUuid } from '@/utils'

type MatchConstructor = OptionalUuid<
  Pick<
    Match,
    | 'uuid'
    | 'clubUuid'
    | 'playerUuids'
    | 'winnerUuids'
    | 'gameUuid'
    | 'results'
    | 'date'
  >
>

@Entity()
@ObjectType()
export class Match extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  public readonly uuid: string

  @Column({ type: 'uuid' })
  public clubUuid: string
  @Field(() => Club)
  public async club(): Promise<Club> {
    return (await Club.findOne({ where: { uuid: this.clubUuid } }))!
  }

  @Column({ type: 'simple-array' })
  public playerUuids: string[]
  @Field(() => [User])
  public async players(): Promise<User[]> {
    return User.find({ where: this.playerUuids.map(uuid => ({ uuid })) })
  }

  @Column({ type: 'simple-array' })
  public winnerUuids: string[]
  @Field(() => [User])
  public async winners(): Promise<User[]> {
    return User.find({ where: this.winnerUuids.map(uuid => ({ uuid })) })
  }

  @Column({ type: 'uuid' })
  public gameUuid: string
  @Field(() => Boardgame)
  public async game(): Promise<Boardgame> {
    return (await Boardgame.findOne({ where: { uuid: this.gameUuid } }))!
  }

  @Column({ type: 'json' })
  @Field(() => GraphQLJSONObject)
  public results: unknown

  @Column({ type: 'timestamp' })
  @Field(() => Date)
  public date: Date

  constructor(options: MatchConstructor) {
    super()

    if (isNil(options)) options = {} as any

    this.uuid = options.uuid || uuid()
    this.clubUuid = options.clubUuid
    this.playerUuids = options.playerUuids
    this.winnerUuids = options.winnerUuids
    this.gameUuid = options.gameUuid
    this.results = options.results
    this.date = options.date
  }
}
