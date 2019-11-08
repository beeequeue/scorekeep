import { Router } from 'express'

import { Session } from '@/modules/session/session.model'
import { setTokenCookie } from '@/modules/session/session.lib'
import { User } from '@/modules/user/user.model'
import {
  Connection,
  ConnectionService,
} from '@/modules/connection/connection.model'
import { isNil } from '@/utils'
import { Google } from './google.lib'

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
    throw new Error('User not found')
  }

  if (isNil(code)) {
    throw new Error('Did not get a code back from Google...')
  }

  const tokens = await Google.getTokens(code, req)

  const googleUser = await Google.getUserFromToken(tokens.token)

  if (isNil(googleUser.email) || googleUser.verified_email) {
    throw new Error('You need to have a verified email address to connect.')
  }

  const existingConnection = await Connection.findOne({
    where: {
      type: ConnectionService.GOOGLE,
      email: googleUser.email,
    },
  })

  if (!isNil(existingConnection)) {
    if (existingConnection.userUuid === user.uuid) {
      throw new Error('You are already connected to this account!')
    }

    throw new Error('This account is already connected to another user!')
  }

  const connection = new Connection({
    type: ConnectionService.GOOGLE,
    userUuid: user.uuid,
    email: googleUser.email,
    serviceId: googleUser.id,
    image: googleUser.picture,
  })

  await connection.save()

  user.mainConnectionUuid = user.mainConnectionUuid || connection.uuid
  await user.save()

  const session = await Session.generate(user)

  setTokenCookie(res)(session)

  res.redirect('/')
})
