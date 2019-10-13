import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql'
import uuid from 'uuid/v4'

import { Boardgame, GAME_TYPE } from '@/modules/boardgame/boardgame.model'

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
    @Arg('url') url: string,
    @Arg('type', { nullable: true }) type: GAME_TYPE = GAME_TYPE.COMPETITIVE,
    @Arg('rulebook', () => String, { nullable: true }) rulebook: string | null,
    @Arg('minPlayers', { nullable: true }) minPlayers: number = 1,
    @Arg('maxPlayers') maxPlayers: number,
  ) {
    const boardgame = Boardgame.from({
      uuid: uuid(),
      type,
      name,
      url,
      rulebook,
      resultTemplateJSON: { something: 'cool' },
      minPlayers,
      maxPlayers,
    })

    return boardgame.save()
  }
}
