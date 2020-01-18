/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { UserInputError } from 'apollo-server-errors'
import Ajv from 'ajv'
import Fuse from 'fuse.js'
import { GraphQLJSONObject } from 'graphql-type-json'
import {
  Arg,
  Args,
  ArgsType,
  Field,
  ID,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import { MaxLength, MinLength } from 'class-validator'

import jsonSchema from '@/assets/json-schema-07.json'
import { PaginatedResponse, PaginationArgs } from '@/modules/pagination'
import { Boardgame, GAME_TYPE } from '@/modules/boardgame/boardgame.model'
import { CustomValidator, JsonSchemaObject } from '@/types/json-schema'
import { createValidationError } from '@/utils/validations'
import { isNil, removeDuplicates } from '@/utils'
import { FindManyOptions } from 'typeorm'

const ajv = new Ajv({ allErrors: true })

const fuse = new Fuse([] as Array<[string, string]>, {
  id: '1',
  keys: ['0'],
  threshold: 0.6,
  maxPatternLength: 50,
  includeScore: true,
  shouldSort: true,
})

const validate = ajv.compile(jsonSchema) as CustomValidator<JsonSchemaObject>

@ObjectType()
class BoardgamesPage extends PaginatedResponse(Boardgame) {}

@ArgsType()
class BoardgamesArgs extends PaginationArgs {
  @Field(() => String, { nullable: true })
  @MinLength(3)
  @MaxLength(50)
  public search!: string | null
}

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
    let searchFilter: FindManyOptions | null = null
    let searchResults: string[] | null = null

    if (!isNil(args.search)) {
      fuse.setCollection(await Boardgame.getBoardgameNames())

      const results = fuse.search(args.search)
      searchResults = removeDuplicates(results.map(({ item }) => item))

      if (results.length < 1) {
        return PaginatedResponse.EMPTY_PAGE
      }

      searchFilter = { where: searchResults.map(uuid => ({ uuid })) }
    }

    let boardgames = await Boardgame.find({
      ...args.getPageFilters(),
      ...searchFilter,
    })
    const count = await Boardgame.count({ ...searchFilter })

    if (!isNil(searchResults)) {
      boardgames = searchResults.map((uuid) =>
        boardgames.find(game => game.uuid === uuid),
      )
    }

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
    @Arg('thumbnail') thumbnail: string,
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
    if (await Boardgame.shortNameExists(shortName)) {
      throw new UserInputError(`Short name "${shortName}" already exists!`)
    }

    // TODO: Move schema validation to a custom GQL type
    // TODO: actually validate against the minimum result schema
    if (
      !Boardgame.validateMinimumResultsSchema(resultsSchema, 'resultsSchema')
    ) {
      throw createValidationError(validate.errors!, 'Invalid resultSchema!')
    }
    if (!isNil(metadataSchema) && !validate(metadataSchema)) {
      throw createValidationError(validate.errors!, 'Invalid metadataSchema!')
    }

    resultsSchema.$schema = 'http://json-schema.org/draft-07/schema#'

    const boardgame = new Boardgame({
      type,
      name,
      shortName,
      aliases,
      thumbnail,
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
