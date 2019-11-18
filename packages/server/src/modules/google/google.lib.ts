/* eslint-disable @typescript-eslint/camelcase */
import superagent from 'superagent'
import { Request } from 'express'
import { google } from 'googleapis'

import { isNil } from '@/utils'

export type GoogleUser = {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

const { GOOGLE_CLIENT, GOOGLE_SECRET } = process.env as {
  [key: string]: string
}
const SCOPE = ['email', 'profile']

const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT, GOOGLE_SECRET)

export class Google {
  private static getRedirectUri = (request: Request) =>
    `${request.protocol}://${request.get('Host')}/connect/google/callback`

  public static getConnectUrl(request: Request) {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPE,
      redirect_uri: this.getRedirectUri(request),
      state: request.query.user,
    })
  }

  public static async getTokens(code: string, request: Request) {
    const response = await oauth2Client.getToken({
      code,
      redirect_uri: this.getRedirectUri(request),
    })

    const { access_token, id_token, refresh_token } = response.tokens
    if (isNil(access_token) || isNil(id_token) || isNil(refresh_token)) {
      throw new Error('Did not receive one of the tokens from Google')
    }

    return {
      token: access_token,
      idToken: id_token,
      refreshToken: refresh_token,
    }
  }

  public static async getUserFromToken(token: string) {
    const response = await superagent
      .get(`https://www.googleapis.com/userinfo/v2/me`)
      .auth(token, { type: 'bearer' })
      .ok(() => true)

    if (response.error || isNil(response.body)) {
      throw new Error('Could not get user from token...')
    }

    return response.body as GoogleUser
  }
}
