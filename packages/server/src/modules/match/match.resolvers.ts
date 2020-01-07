import Ajv from 'ajv'
import { GraphQLJSONObject } from 'graphql-type-json'
import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql'

import { Match } from '@/modules/match/match.model'
import { Boardgame } from '@/modules/boardgame/boardgame.model'
import { JsonSchemaArray } from '@/types/json-schema'
import { isNil } from '@/utils'
import { createValidationError } from '@/utils/validations'

const ajv = new Ajv({ allErrors: true })

@Resolver()
export class MatchResolver {
  @Query(() => Match, { nullable: true })
  public async match(
    @Arg('uuid', () => ID) uuid: string,
  ): Promise<Match | null> {
    return (await Match.findOne({ uuid })) ?? null
  }

  @Mutation(() => Match)
  public async addMatch(
    @Arg('results', () => GraphQLJSONObject)
    playerResults: Array<Record<string, any>>,
    @Arg('metadata', () => GraphQLJSONObject, { nullable: true })
    metadata: Record<string, any> | null,
    @Arg('game', () => ID) gameUuid: string,
    @Arg('club', () => ID, { nullable: true }) clubUuid: string,
  ) {
    const game = await Boardgame.findOne(gameUuid)

    if (isNil(game)) {
      throw new Error('Not found!')
    }

    const enhancedResultsSchema: JsonSchemaArray = {
      type: 'array',
      items: game.resultsSchema,
      minItems: game.minPlayers,
      maxItems: game.maxPlayers,
    }
    const validate = ajv.compile(enhancedResultsSchema)

    if (!await validate(playerResults, 'playerResults')) {
      throw createValidationError(validate.errors!, 'Invalid playerResults!')
    }

    if (!isNil(game.metadataSchema)) {
      const validate = ajv.compile(game.metadataSchema)

      if (!await validate(metadata, 'metadata')) {
        throw createValidationError(validate.errors!, 'Invalid metadata!')
      }
    }

    const playerUuids = playerResults.map(({ player }) => player)
    const winnerUuids = playerResults
      .filter(({ winner }) => winner === true)
      .map(({ player }) => player)

    const match = new Match({
      playerUuids,
      playerResults,
      metadata,
      winnerUuids,
      gameUuid,
      clubUuid,
      date: new Date(),
    })

    return match.save()
  }
}
