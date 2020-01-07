/* eslint-disable @typescript-eslint/camelcase */
import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, Int, ObjectType, registerEnumType } from 'type-graphql'
import { Column, Entity, Index } from 'typeorm'
import { IsUrl, MaxLength, Min } from 'class-validator'

import { ExtendedEntity } from '@/modules/exented-entity'
import { JsonSchemaObject } from '@/types/json-schema'
import { PartialPick } from '@/utils'

type BoardgameConstructor = Pick<
  Boardgame,
  | 'type'
  | 'name'
  | 'shortName'
  | 'aliases'
  | 'url'
  | 'rulebook'
  | 'maxPlayers'
  | 'minPlayers'
  | 'resultsSchema'
> &
  PartialPick<Boardgame, 'uuid' | 'createdAt' | 'metadataSchema'>

export enum GAME_TYPE {
  COLLABORATIVE = 'COLLABORATIVE',
  COMPETITIVE = 'COMPETITIVE',
}
registerEnumType(GAME_TYPE, { name: 'GAME_TYPE' })

const aliasTransformer = {
  from: (arr: string[]) =>
    arr.map(alias => alias.replace(/{escaped_comma}/g, ',')),
  to: (arr: string[]) =>
    arr.map(alias => alias.replace(/,/g, '{escaped_comma}')),
}

@Entity()
@ObjectType()
export class Boardgame extends ExtendedEntity {
  @Column({ length: 15 })
  @Field(() => GAME_TYPE)
  public type: GAME_TYPE

  @Column()
  @Index()
  @Field()
  @MaxLength(50)
  public name: string

  @Column()
  @Index({ unique: true })
  @Field()
  @MaxLength(20)
  public shortName: string

  @Column({ type: 'simple-array', transformer: aliasTransformer })
  @Index()
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
  public resultsSchema: JsonSchemaObject

  @Column({ type: 'json', nullable: true })
  @Field(() => GraphQLJSONObject, { nullable: true })
  public metadataSchema: JsonSchemaObject | null

  constructor(options: BoardgameConstructor) {
    super(options)

    this.type = options?.type
    this.name = options?.name
    this.shortName = options?.shortName
    this.aliases = options?.aliases
    this.url = options?.url
    this.rulebook = options?.rulebook
    this.minPlayers = options?.minPlayers
    this.maxPlayers = options?.maxPlayers
    this.resultsSchema = options?.resultsSchema
    this.metadataSchema = options?.metadataSchema ?? null
    this.createdAt = options?.createdAt!
  }
}
