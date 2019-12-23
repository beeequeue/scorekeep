/* eslint-disable @typescript-eslint/camelcase */
import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, Int, ObjectType, registerEnumType } from 'type-graphql'
import { Column, Entity } from 'typeorm'
import { IsUrl, MaxLength, Min } from 'class-validator'

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
    | 'aliases'
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

const aliasTransformer = {
  from: (arr: string[]) => arr.map(alias => alias.replace(/{escaped_comma}/g, ',')),
  to: (arr: string[]) => arr.map(alias => alias.replace(/,/g, '{escaped_comma}')),
}

@Entity()
@ObjectType()
export class Boardgame extends ExtendedEntity {
  @Column({ length: 15 })
  @Field(() => GAME_TYPE)
  public type: GAME_TYPE

  @Column()
  @Field()
  @MaxLength(50)
  public name: string

  @Column({ type: 'simple-array', transformer: aliasTransformer })
  @Field(() => [String])
  public aliases: string[]

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, {
    nullable: true,
    description: 'Link to boardgamegeek',
  })
  @MaxLength(100)
  @IsUrl({
    allow_protocol_relative_urls: false,
    disallow_auth: true,
    protocols: ['https'],
  })
  public url: string | null

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  @MaxLength(100)
  @IsUrl({
    allow_protocol_relative_urls: false,
    disallow_auth: true,
    protocols: ['https'],
  })
  public rulebook: string | null

  @Column({ type: 'int' })
  @Field(() => Int)
  @Min(1)
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
    this.aliases = options.aliases
    this.url = options.url
    this.rulebook = options.rulebook
    this.minPlayers = options.minPlayers
    this.maxPlayers = options.maxPlayers
    this.resultSchema = options.resultSchema
  }
}
