import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from 'type-graphql'

import { User } from '@/modules/user/user.model'
import { SessionContext } from '@/modules/session/session.lib'
import { createDescription, isNil } from '@/utils'

@Resolver()
export class ConnectionResolver {
  @Mutation(() => User, {
    description: createDescription('Disconnect from a service.', {
      login: true,
    }),
  })
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

    if (connections.length < 2) {
      throw new Error('You need to be connected to at least one service.')
    }

    if (connection.uuid === user.mainConnectionUuid) {
      user.mainConnectionUuid = connections[1].uuid
      await user.save()
    }

    await connection.remove()

    return context.user!
  }
}
