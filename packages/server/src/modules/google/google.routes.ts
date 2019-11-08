import { Response, Router } from 'express'

import { AuthErrorCode } from '@/constants/auth.constants'
import { Session } from '@/modules/session/session.model'
import { setTokenCookie } from '@/modules/session/session.lib'
import { User } from '@/modules/user/user.model'
import {
  Connection,
  ConnectionService,
} from '@/modules/connection/connection.model'
import { isNil } from '@/utils'
import { Google } from './google.lib'

const redirectToFailure = (
  res: Response,
  code: AuthErrorCode,
  extraParams: { [key: string]: string } = {},
) => {
  const url = new URL('http://frontend.url/connect/failed')

  url.searchParams.append('code', code)
  url.searchParams.append('service', ConnectionService.GOOGLE)

  Object.entries(extraParams).forEach(([key, value]) =>
    url.searchParams.append(key, value),
  )

  return res.redirect(url.toString())
}

export const googleRouter = Router()

googleRouter.get('/', (req, res) => {
  res.redirect(Google.getConnectUrl(req))
})

type ICallbackQuery = {
  code?: string
  state?: string
}

googleRouter.get('/callback', async (req, res) => {
  const { code, state: userUuid } = req.query as ICallbackQuery
  let user: User

  if (isNil(code)) {
    // Did not get a code back from Google...
    return redirectToFailure(res, AuthErrorCode.NO_CODE)
  }

  const tokens = await Google.getTokens(code, req)
  const googleUser = await Google.getUserFromToken(tokens.token)

  if (isNil(googleUser.email) || googleUser.verified_email) {
    // You need to have a verified email address on Google to connect.
    return redirectToFailure(res, AuthErrorCode.EMAIL_REQUIRED)
  }

  if (!isNil(userUuid)) {
    const foundUser = await User.findOne({ uuid: userUuid })

    if (isNil(foundUser)) {
      // User not found
      return redirectToFailure(res, AuthErrorCode.USER_NOT_FOUND)
    }

    user = foundUser
  } else {
    user = new User({
      name: googleUser.name,
      mainConnectionUuid: null,
    })
  }

  const existingConnection = await Connection.findOne({
    where: {
      type: ConnectionService.GOOGLE,
      email: googleUser.email,
    },
  })

  if (!isNil(existingConnection)) {
    if (existingConnection.userUuid === user.uuid) {
      // You are already connected to this account!
      return redirectToFailure(res, AuthErrorCode.ALREADY_CONNECTED)
    }

    // This account is already connected to another user!
    return redirectToFailure(res, AuthErrorCode.ANOTHER_USER)
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
