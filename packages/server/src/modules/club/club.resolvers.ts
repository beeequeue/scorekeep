import { Arg, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql'

import { Club } from '@/modules/club/club.model'
import { SessionContext } from '@/modules/session/session.lib'
import { GraphQLError } from 'graphql'

@Resolver()
export class ClubResolver {
  @Query(() => Club, { nullable: true })
  public async club(@Arg('uuid', () => ID) uuid: string): Promise<Club | null> {
    return (await Club.findOne({ uuid })) || null
  }

  @Mutation(() => Club)
  public async addClub(
    @Ctx() context: SessionContext,
    @Arg('name') name: string,
  ) {
    if (!context.isLoggedIn) {
      throw new GraphQLError('You need to be logged in to do this.')
    }

    const club = new Club({
      name,
      ownerUuid: context.user.uuid,
      memberUuids: [],
    })

    return club.save()
  }
}
