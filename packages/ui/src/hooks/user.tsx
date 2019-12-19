import React, { createContext, ReactNode } from 'react'
import gql from 'graphql-tag'
import { UserQuery, useUserQuery } from '@/graphql/generated'

gql`
  query User {
    viewer {
      uuid
      name
      mainConnection {
        uuid
        type
        email
        image
      }
    }
  }
`

const UserContext = createContext<UserQuery['viewer']>(null!)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading, error } = useUserQuery()

  if (loading) return null

  if (error) console.dir(error)

  const user = (data && data.viewer) || null

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const { data, loading, error } = useUserQuery()

  if (error) console.log(error)

  const user = (data && data.viewer) || null

  return { user, loading }
}
