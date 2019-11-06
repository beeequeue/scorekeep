/* eslint-disable @typescript-eslint/consistent-type-definitions */
import Ajv from 'ajv'
import { UserInputError } from 'apollo-server-express'
import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql'
import uuid from 'uuid/v4'

import { Boardgame, GAME_TYPE } from '@/modules/boardgame/boardgame.model'
import { GraphQLJSONObject } from 'graphql-type-json'
import { isNil } from '@/utils'

interface JsonSchema extends JsonSchemaBaseProperty {
  $schema: string
}

interface JsonSchemaBaseProperty {
  type?: 'object' | 'array' | 'string' | 'number' | 'boolean'
  properties?: { [key: string]: JsonSchemaBaseProperty }
  items?: JsonSchemaBaseProperty
  required?: string[]
}

const ajv = new Ajv({ allErrors: true })

const schema: JsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['playerResults'],
  properties: {
    playerResults: {
      type: 'object',
      required: ['winner', 'finalScore'],
      properties: {
        winner: {
          type: 'boolean',
        },
        finalScore: {
          type: 'number',
        },
      },
    },
    metaData: {},
  },
}

const validate = ajv.compile(schema)

@Resolver()
export class BoardgameResolver {
  @Query(() => Boardgame, { nullable: true })
  public async boardgame(
    @Arg('uuid', () => ID) uuid: string,
  ): Promise<Boardgame | null> {
    return (await Boardgame.findOne({ where: { uuid } })) || null
  }

  @Mutation(() => Boardgame)
  public async addBoardgame(
    @Arg('name') name: string,
    @Arg('maxPlayers') maxPlayers: number,
    @Arg('resultSchema', () => GraphQLJSONObject)
    resultSchema: unknown,
    // Nullable
    @Arg('url', () => String, { nullable: true })
    url: string | null,
    @Arg('type', () => GAME_TYPE, { nullable: true })
    type: GAME_TYPE = GAME_TYPE.COMPETITIVE,
    @Arg('rulebook', () => String, { nullable: true })
    rulebook: string | null,
    @Arg('minPlayers', { nullable: true })
    minPlayers: number = 1,
  ) {
    const boardgame = Boardgame.from({
      uuid: uuid(),
      type,
      name,
      url,
      rulebook,
      resultSchema,
      minPlayers,
      maxPlayers,
    })

    // Move schema validation to GQL type
    validate(resultSchema)

    if (!isNil(validate.errors) && validate.errors.length > 0) {
      throw new UserInputError('Invalid schema!', {
        validation: validate.errors.map(error => ({
          path: error.dataPath.split('.').filter(Boolean),
          message: error.message,
        })),
      })
    }

    return boardgame.save()
  }
}
