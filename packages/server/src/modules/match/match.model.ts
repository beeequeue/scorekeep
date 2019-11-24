import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ObjectType } from 'type-graphql'
import { Column, Entity } from 'typeorm'

import { ExtendedEntity } from '@/modules/exented-entity'
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
export class Match extends ExtendedEntity {
  @Column({ type: 'uuid' })
  public clubUuid: string
  @Field(() => Club)
  public async club(): Promise<Club> {
    const club = await Club.findOne({ uuid: this.clubUuid })

    if (isNil(club)) {
      throw this.shouldExistError(Club, this.clubUuid)
    }

    return club
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
  public results: unknown

  @Column({ type: 'timestamp' })
  @Field(() => Date)
  public date: Date

  constructor(options: MatchConstructor) {
    super(options)

    if (isNil(options)) options = {} as any

    this.clubUuid = options.clubUuid
    this.playerUuids = options.playerUuids
    this.winnerUuids = options.winnerUuids
    this.gameUuid = options.gameUuid
    this.results = options.results
    this.date = options.date
  }
}
