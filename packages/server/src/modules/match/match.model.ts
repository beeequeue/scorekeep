import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ObjectType } from 'type-graphql'
import { Column, Entity } from 'typeorm'

import { ExtendedEntity } from '@/modules/exented-entity'
import { User } from '@/modules/user/user.model'
import { Boardgame } from '@/modules/boardgame/boardgame.model'
import { Club } from '@/modules/club/club.model'
import { isNil, PartialPick } from '@/utils'

type MatchConstructor = Pick<
  Match,
  'playerUuids' | 'winnerUuids' | 'gameUuid' | 'results' | 'date'
> &
  PartialPick<Match, 'uuid' | 'clubUuid' | 'metadata'>

@Entity()
@ObjectType()
export class Match extends ExtendedEntity {
  @Column({ type: 'uuid', nullable: true })
  public clubUuid: string | null
  @Field(() => Club, { nullable: true })
  public async club(): Promise<Club | null> {
    if (isNil(this.clubUuid)) return null

    const club = await Club.findOne({ uuid: this.clubUuid })

    return club ?? null
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
    const game = await Boardgame.findOne({ uuid: this.gameUuid })

    if (isNil(game)) {
      throw this.shouldExistError(Boardgame, this.gameUuid)
    }

    return game
  }

  @Column({ type: 'json' })
  @Field(() => GraphQLJSONObject)
  public results: Record<string, any>

  @Column({ type: 'json', nullable: true })
  @Field(() => GraphQLJSONObject, { nullable: true })
  public metadata: Record<string, any> | null

  @Column({ type: 'timestamp' })
  @Field(() => Date)
  public date: Date

  constructor(options: MatchConstructor) {
    super(options)

    this.clubUuid = options?.clubUuid ?? null
    this.playerUuids = options?.playerUuids
    this.winnerUuids = options?.winnerUuids
    this.gameUuid = options?.gameUuid
    this.results = options?.results
    this.metadata = options?.metadata ?? null
    this.date = options?.date
  }
}
