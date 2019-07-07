import { Router } from 'express'

import { User } from '@/modules/user/user.model'
import { Google } from './google.lib'
import { isNil } from '@/utils'

export const googleRouter = Router()

googleRouter.get('/', (req, res) => {
  res.redirect(Google.getConnectUrl(req))
})

interface ICallbackQuery {
  code?: string
  state?: string
}

googleRouter.get('/callback', async (req, res) => {
  const { code, state } = req.query as ICallbackQuery

  const user = await User.findOne({ uuid: state })

  if (isNil(user)) {
    // throw new Error('User not found')
  }

  if (isNil(code)) {
    throw new Error('Did not get a code back from Discord...')
  }

  const tokens = await Google.getTokens(code, req)

  const googleUser = await Google.getUserFromToken(tokens.token)

  if (!googleUser.email || !googleUser.verified_email) {
    throw new Error('You need to have a verified email address to connect.')
  }

  res.redirect('/')
})
