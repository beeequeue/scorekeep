import { Response } from 'express'
// eslint-disable-next-line node/no-extraneous-import
import { ContextFunction } from 'apollo-server-core'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import { oc } from 'ts-optchain'

import { Session } from '@/modules/session/session.model'
import { User } from '@/modules/user/user.model'
import { isNil, isUuid } from '@/utils'

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

const isValidToken = (str?: string) => !isNil(str) && isUuid(str)

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
  let session: Session | undefined

  const header = req.header('Authorization') || ''
  const tokenMatch = /^Bearer (.*)$/.exec(header)
  let token = oc(tokenMatch)[0]()

  if (isValidToken(token)) {
    session = await Session.findOne({ uuid: token })
  }

  // No Bearer session found
  if (isNil(session)) {
    token = req.cookies.token

    if (isValidToken(token)) {
      session = await Session.findOne({ uuid: token })
    }
  }

  const contextSetSession = setTokenCookie(res)

  if (!isNil(session)) {
    contextSetSession(session)
  }

  return getContextSession(session || null, contextSetSession)
}
