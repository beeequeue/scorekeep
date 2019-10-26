import { Response } from 'express'
import { ContextFunction } from 'apollo-server-core'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import { oc } from 'ts-optchain'

import { Session } from '@/modules/session/session.model'
import { User } from '@/modules/user/user.model'
import { isNil } from '@/utils'

const setSession = (res: Response) => (session: Session) =>
  res.cookie('token', session.uuid, {
    expires: session.expiresAt,
    secure: process.env.NODE_ENV === 'production',
  })

type NoUserSessionContext = {
  session: Session
  user: null
  isLoggedIn: false
  setSession: (session: Session) => void
}

type UserSessionContext = {
  session: Session
  user: User
  isLoggedIn: true
  setSession: (session: Session) => void
}

export type SessionContext = UserSessionContext | NoUserSessionContext

export const contextProvider: ContextFunction<
  ExpressContext,
  SessionContext
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
  // TODO: Not sessions unless you logged in
  // No cookie session found
  if (isNil(session)) {
    session = await Session.generate()
  }

  const contextSetSession = setSession(res)

  contextSetSession(session)

  const user = await session.getUser()

  if (isNil(user)) {
    return {
      session,
      user: null,
      isLoggedIn: false as const,
      setSession: contextSetSession,
    }
  }

  return {
    session,
    user: user,
    isLoggedIn: true as const,
    setSession: contextSetSession,
  }
}
