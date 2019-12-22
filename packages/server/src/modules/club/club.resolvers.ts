import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql'

import { Club } from '@/modules/club/club.model'
import { SessionContext } from '@/modules/session/session.lib'

@Resolver()
export class ClubResolver {
  @Query(() => Club, { nullable: true })
  public async club(@Arg('uuid', () => ID) uuid: string): Promise<Club | null> {
    return (await Club.findOne({ uuid })) || null
  }

  @Mutation(() => Club)
  @Authorized()
  public async addClub(
    @Ctx() context: SessionContext,
    @Arg('name') name: string,
  ) {
    const club = new Club({
      name,
      ownerUuid: context.session!.user.uuid,
      memberUuids: [],
    })

    return club.save()
  }
}
