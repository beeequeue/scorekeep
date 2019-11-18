import { Response, Router } from 'express'

import { AuthErrorCode } from '@/constants/auth.constants'
import { Session } from '@/modules/session/session.model'
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
  const { code } = req.query as ICallbackQuery
  let currentSession: Session | null = null

  if (isNil(code)) {
    // Did not get a code back from Google...
    return redirectToFailure(res, AuthErrorCode.NO_CODE)
  }

  if (req.cookies.token) {
    currentSession = await Session.findByUuid(req.cookies.token)

    if (isNil(currentSession)) {
      // User not found
      return redirectToFailure(res, AuthErrorCode.USER_NOT_FOUND)
    }
  }

  const tokens = await Google.getTokens(code, req)
  const googleUser = await Google.getUserFromToken(tokens.token)

  if (isNil(googleUser.email) || googleUser.verified_email) {
    // You need to have a verified email address on Google to connect.
    return redirectToFailure(res, AuthErrorCode.EMAIL_REQUIRED)
  }

  const existingConnection = await Connection.findOne({
    where: {
      type: ConnectionService.GOOGLE,
      email: googleUser.email,
    },
  })

  // If the service account is connected to someone
  if (!isNil(existingConnection)) {
    if (
      !isNil(req.session) &&
      req.session.user.uuid !== existingConnection.userUuid
    ) {
      return redirectToFailure(res, AuthErrorCode.ANOTHER_USER)
    }

    await Session.login(req, await existingConnection.user())

    return res.redirect('/')
  }

  // If user is logged in and is connecting a new account
  if (!isNil(req.session)) {
    await req.session.user.connectTo({
      type: ConnectionService.GOOGLE,
      email: googleUser.email,
      serviceId: googleUser.id,
      image: googleUser.picture,
    })

    return res.redirect('/')
  }

  const newUser = new User({
    name: googleUser.name,
    mainConnectionUuid: null,
  })

  await newUser.connectTo({
    type: ConnectionService.GOOGLE,
    email: googleUser.email,
    serviceId: googleUser.id,
    image: googleUser.picture,
  })

  await Session.login(req, newUser)

  res.redirect('/')
})
