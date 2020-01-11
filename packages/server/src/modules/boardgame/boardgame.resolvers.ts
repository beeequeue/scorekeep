/* eslint-disable @typescript-eslint/consistent-type-definitions */
import Ajv from 'ajv'
import { GraphQLJSONObject } from 'graphql-type-json'
import {
  Arg,
  Args,
  ArgsType,
  ID,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'

import jsonSchema from '@/assets/json-schema-07.json'
import { PaginatedResponse, PaginationArgs } from '@/modules/pagination'
import { Boardgame, GAME_TYPE } from '@/modules/boardgame/boardgame.model'
import { CustomValidator, JsonSchemaObject } from '@/types/json-schema'
import { createValidationError } from '@/utils/validations'

const ajv = new Ajv({ allErrors: true })

const validate = ajv.compile(jsonSchema) as CustomValidator<JsonSchemaObject>

@ObjectType()
class BoardgamesPage extends PaginatedResponse(Boardgame) {}

@ArgsType()
class BoardgamesArgs extends PaginationArgs {}

@Resolver()
export class BoardgameResolver {
  @Query(() => Boardgame, { nullable: true })
  public async boardgame(
    @Arg('uuid', () => ID) uuid: string,
  ): Promise<Boardgame | null> {
    return (await Boardgame.findOne({ uuid })) ?? null
  }

  @Query(() => BoardgamesPage)
  public async boardgames(
    @Args() args: BoardgamesArgs,
  ): Promise<BoardgamesPage> {
    const boardgames = await Boardgame.find({ ...args.getFilters() })
    const count = await Boardgame.count({ ...args.getFilters() })

    const nextOffset = args.offset + args.limit
    return {
      items: boardgames,
      nextOffset: nextOffset < count ? nextOffset : null,
      total: count,
    }
  }

  @Mutation(() => Boardgame)
  public async addBoardgame(
    @Arg('name') name: string,
    @Arg('shortName') shortName: string,
    @Arg('maxPlayers', () => Int) maxPlayers: number,
    @Arg('resultsSchema', () => GraphQLJSONObject)
    resultsSchema: object,
    // Nullable
    @Arg('aliases', () => [String], { nullable: true })
    aliases: string[] = [],
    @Arg('url', () => String, { nullable: true })
    url: string | null,
    @Arg('type', () => GAME_TYPE, { nullable: true })
    type: GAME_TYPE = GAME_TYPE.COMPETITIVE,
    @Arg('rulebook', () => String, { nullable: true })
    rulebook: string | null,
    @Arg('minPlayers', () => Int, { nullable: true })
    minPlayers: number = 1,
    @Arg('metadataSchema', () => GraphQLJSONObject, { nullable: true })
    metadataSchema: object | null,
  ) {
    // TODO: Move schema validation to a custom GQL type
    // TODO: actually validate against the minimum result schema
    if (!Boardgame.validateMinimumResultsSchema(resultsSchema, 'resultsSchema')) {
      throw createValidationError(validate.errors!, 'Invalid resultSchema!')
    }
    if (!validate(metadataSchema)) {
      throw createValidationError(validate.errors!, 'Invalid metadataSchema!')
    }

    resultsSchema.$schema = 'http://json-schema.org/draft-07/schema#'

    const boardgame = new Boardgame({
      type,
      name,
      shortName,
      aliases,
      url,
      rulebook,
      minPlayers,
      maxPlayers,
      resultsSchema,
      metadataSchema,
    })

    return boardgame.save()
  }
}
