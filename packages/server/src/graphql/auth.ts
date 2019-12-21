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
    return false
  }

  if (roles.includes(Role.OWNER)) {
    if (!(root instanceof EntityWithOwner)) {
      throw new Error(
        `Required OWNER role on model without owner (${root.name})!`,
      )
    }

    return context.session?.user.uuid === (await root.getOwner()).uuid
  }

  return true
}
