import { createContext, useContext } from 'react'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { JWTData } from '@scorekeep/constants/src'

const cookies = cookie.parse(document.cookie)

export const getUserFromCookie = () => {
  let data: JWTData | null = null

  if (!cookies.token) return null

  try {
    data = jwt.verify(cookies.token, 'scorekeep') as JWTData
  } catch {
    /* no-op */
  }

  return data
}

export const UserContext = createContext<JWTData | null>(null)

export const useUser = () => {
  const user = useContext(UserContext)

  return { user }
}
