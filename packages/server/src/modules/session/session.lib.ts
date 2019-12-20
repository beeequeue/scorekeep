import { Response } from 'express'
// eslint-disable-next-line node/no-extraneous-import
import { ContextFunction } from 'apollo-server-core'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'

import { Session } from '@/modules/session/session.model'
import { User } from '@/modules/user/user.model'
import { isNil } from '@/utils'

export const setTokenCookie = (res: Response) => (session: Session) =>
  res.cookie('token', session.uuid, {
    expires: session.expiresAt,
    secure: process.env.NODE_ENV === 'production',
  })

type NoSessionContext = {
  session: null
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

export type SessionContext = UserSessionContext | NoSessionContext

const getContextSession = async (
  session: Session | null,
  setSession: (session: Session) => Response,
): Promise<SessionContext> => {
  if (isNil(session)) {
    return {
      session: null,
      user: null,
      isLoggedIn: false,
      setSession,
    }
  }

  return {
    session: session,
    user: session.user,
    isLoggedIn: true,
    setSession,
  }
}

export const contextProvider: ContextFunction<
  ExpressContext,
  SessionContext
> = async ({ req, res }) => {
  let session: Session | null = null

  const header = req.header('Authorization')

  if (!isNil(header)) {
    const token = header.slice(7) // Removes `Bearer `
    session = (await Session.findOne({ uuid: token })) ?? null
  }

  // No Bearer session found
  if (isNil(session)) {
    session = (await Session.findOne({ uuid: req.cookies.token })) ?? null
  }

  const contextSetSession = setTokenCookie(res)

  if (!isNil(session)) {
    contextSetSession(session)
  }

  return getContextSession(session || null, contextSetSession)
}
