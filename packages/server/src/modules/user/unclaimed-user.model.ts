import { Entity } from 'typeorm'
import { Authorized, Ctx, Field, ObjectType } from 'type-graphql'

import { Friendship } from '@/modules/friendship/friendship.model'
import { UserBase } from '@/modules/user/user-base.model'
import { SessionContext } from '@/modules/session/session.lib'
import { OptionalUuid } from '@/utils'

type UserConstructor = OptionalUuid<Pick<UserBase, 'uuid' | 'name'>>

@Entity()
@ObjectType()
export class UnclaimedUser extends UserBase {
  constructor(options: UserConstructor) {
    super(options)

    this.name = options?.name
  }

  @Field(() => Date)
  @Authorized()
  public async friendsSince(
    @Ctx() context: SessionContext,
  ): Promise<Date | null> {
    const { uuid } = context.session!.user
    const friendship = await Friendship.findOne({
      where: [{ initiatorUuid: uuid }],
    })

    return friendship?.accepted ?? null
  }
}
