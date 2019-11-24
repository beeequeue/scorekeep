/* eslint-disable @typescript-eslint/consistent-type-definitions */
import Ajv from 'ajv'
import { GraphQLJSONObject } from 'graphql-type-json'
import { Arg, ID, Int, Mutation, Query, Resolver } from 'type-graphql'

import jsonSchema from '@/assets/json-schema-07.json'
import { Boardgame, GAME_TYPE } from '@/modules/boardgame/boardgame.model'
import { CustomValidator, JsonSchemaObject } from '@/types/json-schema'
import { createValidationError } from '@/utils/validations'

const ajv = new Ajv({ allErrors: true })

const validate = ajv.compile(jsonSchema) as CustomValidator<JsonSchemaObject>

@Resolver()
export class BoardgameResolver {
  @Query(() => Boardgame, { nullable: true })
  public async boardgame(
    @Arg('uuid', () => ID) uuid: string,
  ): Promise<Boardgame | null> {
    return (await Boardgame.findOne({ uuid })) || null
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
