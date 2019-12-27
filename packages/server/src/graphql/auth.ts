import { AuthChecker } from 'type-graphql'
import { SessionContext } from '@/modules/session/session.lib'
import { EntityWithOwner } from '@/modules/exented-entity'
import { isNil } from '@/utils'

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

    const owners = await root.getOwners()

    return !isNil(
      owners.find(owner => owner.uuid === context.session?.user.uuid),
    )
  }

  return true
}
