import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql'
import uuid from 'uuid/v4'

import { Match } from '@/modules/match/match.model'
import { GraphQLJSONObject } from 'graphql-type-json'

@Resolver()
export class MatchResolver {
  @Query(() => Match, { nullable: true })
  public async match(
    @Arg('uuid', () => ID) uuid: string,
  ): Promise<Match | null> {
    return (await Match.findOne({ where: { uuid } })) || null
  }

  @Mutation(() => Match)
  public async addMatch(
    @Arg('players', () => [ID]) players: string[],
    @Arg('results', () => GraphQLJSONObject) results: object,
    @Arg('winners', () => [ID]) winners: string[],
    @Arg('game', () => ID) game: string,
    @Arg('club', () => ID) club: string,
  ) {
    const match = Match.from({
      uuid: uuid(),
      playerUuids: players,
      results,
      winnerUuids: winners,
      gameUuid: game,
      date: new Date(),
      clubUuid: club,
    })

    return match.save()
  }
}
