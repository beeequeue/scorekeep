import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, Int, ObjectType, registerEnumType } from 'type-graphql'
import { Column, Entity } from 'typeorm'

import { ExtendedEntity } from '@/modules/exented-entity'
import { JsonSchemaObject } from '@/types/json-schema'
import { isNil, OptionalUuid } from '@/utils'

export type ResultBase = {
  playerResults: Array<{
    player: string
    winner: boolean
    total: number
    [key: string]: any | undefined
  }>
  metadata?: {
    [key: string]: any | undefined
  }
}

type BoardgameConstructor = OptionalUuid<
  Pick<
    Boardgame,
    | 'uuid'
    | 'name'
    | 'type'
    | 'url'
    | 'rulebook'
    | 'maxPlayers'
    | 'minPlayers'
    | 'resultSchema'
  >
>

export enum GAME_TYPE {
  COLLABORATIVE = 'COLLABORATIVE',
  COMPETITIVE = 'COMPETITIVE',
}
registerEnumType(GAME_TYPE, { name: 'GAME_TYPE' })

@Entity()
@ObjectType()
export class Boardgame extends ExtendedEntity {
  @Column({ length: 15 })
  @Field(() => GAME_TYPE)
  public type: GAME_TYPE

  @Column({ length: 50 })
  @Field()
  public name: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Field(() => String, {
    nullable: true,
    description: 'Link to boardgamegeek',
  })
  public url: string | null

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Field(() => String, { nullable: true })
  public rulebook: string | null

  @Column({ type: 'int' })
  @Field(() => Int)
  public minPlayers: number

  @Column({ type: 'int' })
  @Field(() => Int)
  public maxPlayers: number

  @Column({ type: 'json' })
  @Field(() => GraphQLJSONObject)
  public resultSchema: JsonSchemaObject

  constructor(options: BoardgameConstructor) {
    super(options)

    if (isNil(options)) options = {} as any

    this.type = options.type
    this.name = options.name
    this.url = options.url
    this.rulebook = options.rulebook
    this.minPlayers = options.minPlayers
    this.maxPlayers = options.maxPlayers
    this.resultSchema = options.resultSchema
  }
}
