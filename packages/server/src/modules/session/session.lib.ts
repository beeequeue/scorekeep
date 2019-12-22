import { Response } from 'express'
// eslint-disable-next-line node/no-extraneous-import
import { ContextFunction } from 'apollo-server-core'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'

import { Session } from '@/modules/session/session.model'
import { isNil, isUuid } from '@/utils'

export const setTokenCookie = (res: Response) => (session: Session) =>
  res.cookie('token', session.uuid, {
    expires: session.expiresAt,
    secure: process.env.NODE_ENV === 'production',
  })

type NoSessionContext = {
  session: null
  isLoggedIn: false
  setSession: (session: Session) => void
}

type UserSessionContext = {
  session: Session
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
      isLoggedIn: false,
      setSession,
    }
  }

  return {
    session: session,
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
  const token = header?.slice(7) // Removes `Bearer `

  if (isUuid(token)) {
    session = (await Session.findOne({ uuid: token })) ?? null
  }

  // No Bearer session found
  if (isNil(session) && isUuid(req.cookies.token)) {
    session = (await Session.findOne({ uuid: req.cookies.token })) ?? null
  }

  const contextSetSession = setTokenCookie(res)

  if (!isNil(session)) {
    contextSetSession(session)
  }

  return getContextSession(session || null, contextSetSession)
}
