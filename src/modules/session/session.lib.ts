import { oc } from 'ts-optchain'
import { ContextFunction } from 'apollo-server-core'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'

import { Session } from '@/modules/session/session.model'
import { User } from '@/modules/user/user.model'
import { isNil } from '@/utils'

interface NoSessionContext {
  session: Session
  user: undefined
  isLoggedIn: false
}

interface SessionContext {
  session: Session
  user: User
  isLoggedIn: true
}

export const contextProvider: ContextFunction<
  ExpressContext,
  SessionContext | NoSessionContext
> = async ({ req, res }) => {
  let session: Session | undefined

  const header = req.header('Authorization') || ''
  const tokenMatch = /^Bearer (.*)$/.exec(header)
  const token = oc(tokenMatch)[0]()

  session = await Session.findOne({ uuid: token })

  // No Bearer session found
  if (isNil(session)) {
    const { token = undefined } = req.cookies

    if (!isNil(token)) {
      session = await Session.findOne({ uuid: token })
    }

    if (isNil(token) || isNil(session)) {
      res.clearCookie('token')
    }
  }

  // No cookie session found
  if (isNil(session)) {
    session = await Session.generate()
  }

  res.cookie('token', session.uuid, {
    expires: session.expiresAt,
    secure: process.env.NODE_ENV === 'production',
  })

  const user = await session.getUser()
  const isLoggedIn = isNil(user)

  if (!isLoggedIn) {
    return {
      session,
      user: undefined,
      isLoggedIn: false as const,
    }
  }

  return {
    session,
    user: user!,
    isLoggedIn: true as const,
  }
}
