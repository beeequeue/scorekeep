import { AuthChecker } from 'type-graphql'
import { SessionContext } from '@/modules/session/session.lib'
import { EntityWithOwner } from '@/modules/exented-entity'

export enum Role {
  OWNER = 'OWNER',
}

export const authChecker: AuthChecker<SessionContext, Role> = async (
  { root, context },
  roles,
) => {
  if (!context.isLoggedIn) {
    throw new Error('You have to be logged in to access this field.')
  }

  if (roles.includes(Role.OWNER)) {
    if (!(root instanceof EntityWithOwner)) {
      throw new Error(
        `Required OWNER role on model without owner (${root.name})!`,
      )
    }

    return context.user?.uuid === (await root.getOwner()).uuid
  }

  return true
}
