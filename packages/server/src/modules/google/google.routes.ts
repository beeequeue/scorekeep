import { Router } from 'express'
import uuid from 'uuid/v4'

import { Session } from '@/modules/session/session.model'
import { setTokenCookie } from '@/modules/session/session.lib'
import { User } from '@/modules/user/user.model'
import { Google } from './google.lib'
import { isNil } from '@/utils'

export const googleRouter = Router()

googleRouter.get('/', (req, res) => {
  res.redirect(Google.getConnectUrl(req))
})

type ICallbackQuery = {
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
    throw new Error('Did not get a code back from Google...')
  }

  const tokens = await Google.getTokens(code, req)

  const googleUser = await Google.getUserFromToken(tokens.token)

  if (!googleUser.email || !googleUser.verified_email) {
    throw new Error('You need to have a verified email address to connect.')
  }

  const newUser = User.from({
    uuid: uuid(),
    name: googleUser.name,
  })

  await newUser.save()

  const session = await Session.generate(newUser)

  setTokenCookie(res)(session)

  res.redirect('/')
})
