import { Arg, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql'
import uuid from 'uuid/v4'

import { Club } from '@/modules/club/club.model'
import { SessionContext } from '@/modules/session/session.lib'
import { GraphQLError } from 'graphql'

@Resolver()
export class ClubResolver {
  @Query(() => Club, { nullable: true })
  public async club(@Arg('uuid', () => ID) uuid: string): Promise<Club | null> {
    return (await Club.findOne({ where: { uuid } })) || null
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @Mutation(() => Club)
  public async addClub(
    @Ctx() context: SessionContext,
    @Arg('name', { nullable: true }) name: string = 'Kool Kidz Klub',
  ) {
    if (!context.isLoggedIn) {
      throw new GraphQLError('You need to be logged in to do this.')
    }

    const club = Club.from({
      uuid: uuid(),
      name,
      ownerUuid: context.user.uuid,
    })

    return club.save()
  }
}
