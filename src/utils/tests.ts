import { addDays } from 'date-fns'

import { Connection } from '@/modules/connection/connection.model'
import { Invite } from '@/modules/invite/invite.model'
import { Plan } from '@/modules/plan/plan.model'
import { Session } from '@/modules/session/session.model'
import { Subscription } from '@/modules/subscription/subscription.model'
import { AccessLevel, User } from '@/modules/user/user.model'
import { isNil } from '@/utils/functional'

export const cleanupDatabases = () =>
  Promise.all([
    Connection.table().delete(),
    Invite.table().delete(),
    Plan.table().delete(),
    Session.table().delete(),
    Subscription.table().delete(),
    User.table().delete(),
  ])

interface InsertUserOptions {
  index?: number
  email?: string
  discord?: string
  stripe?: string
}

export const insertUser = async ({
  index = 0,
  email,
  discord,
  stripe,
}: InsertUserOptions = {}) => {
  const user = new User({
    email: email || `email_${index}@gmail.com`,
    discordId: discord || `discord_id_${index}`,
    stripeId: stripe || `stripe_id_${index}`,
    accessLevel: AccessLevel.ADMIN,
  })

  await user.save()

  return user
}

interface InsertPlanOptions {
  ownerUuid?: string
  name?: string
  amount?: number
}

export const insertPlan = async ({
  ownerUuid,
  name,
  amount,
}: InsertPlanOptions = {}) => {
  if (isNil(ownerUuid)) {
    ownerUuid = (await insertUser()).uuid
  }

  const plan = new Plan({
    name: name || 'plan',
    amount: amount || 12_99,
    paymentDay: 1,
    ownerUuid,
  })

  await plan.save()

  return plan
}

interface InsertInviteOptions {
  planUuid?: string
}

export const insertInvite = async ({ planUuid }: InsertInviteOptions) => {
  if (isNil(planUuid)) {
    planUuid = (await insertPlan()).uuid
  }

  const invite = new Invite({
    shortId: await Invite.generateShortId(),
    cancelled: false,
    planUuid,
    expiresAt: addDays(new Date(), 7),
  })

  await invite.save()

  return invite
}

export const assertObjectEquals = <T extends {}>(result: T, user: T) => {
  expect(JSON.stringify(result, null, 2)).toEqual(JSON.stringify(user, null, 2))
}
