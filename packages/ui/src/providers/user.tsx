import React, { createContext, ReactNode, useContext } from 'react'
import { UserQuery, useUserQuery } from '@/graphql/generated'

type User = NonNullable<UserQuery['viewer']>
const UserContext = createContext<User | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading, error } = useUserQuery()

  if (loading) return null

  // eslint-disable-next-line no-console
  if (error) console.dir(error)

  const user = data && data.viewer || null

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const user = useContext(UserContext)

  return { user }
}
