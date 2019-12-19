import { Response } from 'express'
// eslint-disable-next-line node/no-extraneous-import
import { ContextFunction } from 'apollo-server-core'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'

import { Session } from '@/modules/session/session.model'
import { isNil } from '@/utils'

export const setTokenCookie = (res: Response) => async (session: Session) =>
  res.cookie('token', await session.getJWT(), {
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
  setSession: (session: Session) => Promise<Response>,
): Promise<SessionContext> => {
  if (isNil(session)) {
    return {
      session: null,
      isLoggedIn: false,
      setSession,
    }
  }

  return {
    session,
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

  session = await Session.findByJWT(token)

  // No Bearer session found
  if (isNil(session)) {
    session = await Session.findByJWT(req.cookies.token)
  }

  const contextSetSession = setTokenCookie(res)

  if (!isNil(session)) {
    await contextSetSession(session)
  }

  return getContextSession(session || null, contextSetSession)
}
