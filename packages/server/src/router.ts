import { Router } from 'express'

import { Session } from '@/modules/session/session.model'
import { User } from '@/modules/user/user.model'
import { contextProvider } from '@/modules/session/session.lib'
import { googleRouter } from '@/modules/google/google.routes'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      session: Session | null
      user: User | null
      isLoggedIn: boolean
      setSession: (session: Session) => void
    }
  }
}
export const router = Router()

router.use(async (req, res, next) => {
  const context = await contextProvider({ req, res })

  Object.assign(req, context)

  next()
})

router.use('/connect/google', googleRouter)
