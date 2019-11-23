import Ajv from 'ajv'
import { GraphQLJSONObject } from 'graphql-type-json'
import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql'

import { Match } from '@/modules/match/match.model'
import { Boardgame, ResultBase } from '@/modules/boardgame/boardgame.model'
import { CustomValidator, JsonSchemaArray } from '@/types/json-schema'
import { isNil } from '@/utils'
import { createValidationError } from '@/utils/validations'

const ajv = new Ajv({ allErrors: true })

@Resolver()
export class MatchResolver {
  @Query(() => Match, { nullable: true })
  public async match(
    @Arg('uuid', () => ID) uuid: string,
  ): Promise<Match | null> {
    return (await Match.findOne({ uuid })) || null
  }

  @Mutation(() => Match)
  public async addMatch(
    @Arg('results', () => GraphQLJSONObject) results: object,
    @Arg('game', () => ID) gameUuid: string,
    @Arg('club', () => ID, { nullable: true }) clubUuid: string,
  ) {
    const game = await Boardgame.findOne(gameUuid)

    if (isNil(game)) {
      throw new Error('Not found!')
    }

    const improvedSchema = game.resultSchema
    ;(improvedSchema.properties!.playerResults as JsonSchemaArray).minItems =
      game.minPlayers
    ;(improvedSchema.properties!.playerResults as JsonSchemaArray).maxItems =
      game.maxPlayers

    const validate = ajv.compile(game.resultSchema) as CustomValidator<
      ResultBase
    >

    if (!validate(results, 'results')) {
      throw createValidationError(validate.errors!, 'Invalid result!')
    }

    const playerUuids = results.playerResults.map(({ player }) => player)
    const winnerUuids = results.playerResults
      .filter(({ winner }) => winner === true)
      .map(({ player }) => player)

    const match = new Match({
      playerUuids,
      results,
      winnerUuids,
      gameUuid,
      clubUuid,
      date: new Date(),
    })

    return match.save()
  }
}
