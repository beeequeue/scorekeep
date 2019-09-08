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
  public async addBoardgame() {
    const boardgame = Boardgame.from({
      uuid: uuid(),
      type: GAME_TYPE.COMPETITIVE,
      name: 'A board game',
      url: 'https://google.com',
      rulebook: 'https://google.com',
      resultTemplateJSON: { something: 'cool' },
      minPlayers: 1,
      maxPlayers: 4,
    })

    return boardgame.save()
  }
}
