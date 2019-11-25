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

  @Query(() => [Boardgame], { nullable: true })
  public async boardgames(): Promise<Boardgame[] | null> {
    return await Boardgame.find()
  }

  @Query(() => BoardgamesPage)
  public async boardgames(
    @Args() args: BoardgamesArgs,
  ): Promise<BoardgamesPage> {
    const boardgames = await Boardgame.find({ ...args.getFilters() })

    return {
      items: boardgames,
      nextOffset: 0,
      total: 0,
    }
  }

  @Mutation(() => Boardgame)
  public async addBoardgame(
    @Arg('name') name: string,
    @Arg('maxPlayers', () => Int) maxPlayers: number,
    @Arg('resultSchema', () => GraphQLJSONObject)
    resultSchema: object,
    // Nullable
    @Arg('url', () => String, { nullable: true })
    url: string | null,
    @Arg('type', () => GAME_TYPE, { nullable: true })
    type: GAME_TYPE = GAME_TYPE.COMPETITIVE,
    @Arg('rulebook', () => String, { nullable: true })
    rulebook: string | null,
    @Arg('minPlayers', () => Int, { nullable: true })
    minPlayers: number = 1,
  ) {
    // TODO: Move schema validation to a custom GQL type
    validate(resultSchema)

    // TODO: actually validate against the minimum result schema
    if (!validate(resultSchema)) {
      throw createValidationError(validate.errors!, 'Invalid schema!')
    }

    const boardgame = new Boardgame({
      type,
      name,
      url,
      rulebook,
      resultSchema,
      minPlayers,
      maxPlayers,
    })

    return boardgame.save()
  }
}
