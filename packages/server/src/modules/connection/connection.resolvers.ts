import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from 'type-graphql'

import { User } from '@/modules/user/user.model'
import { SessionContext } from '@/modules/session/session.lib'
import { isNil } from '@/utils'

@Resolver()
export class ConnectionResolver {
  @Mutation(() => User)
  @Authorized()
  public async disconnect(
    @Ctx() context: SessionContext,
    @Arg('uuid', () => ID) uuid: string,
  ): Promise<User> {
    const user = context.user!
    const connections = await user.connections()
    const connection = connections.find(conn => conn.uuid === uuid)

    if (isNil(connection)) {
      throw new Error('No connection found with that UUID.')
    }

    if (connection.uuid === user.mainConnectionUuid) {
      user.mainConnectionUuid = connections[1]?.uuid ?? null
      await user.save()
    }

    await connection.remove()

    return context.user!
  }
}
