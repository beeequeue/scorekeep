import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'

import { createSchema } from '@/graphql'

export const createServer = async () => {
  const server = new ApolloServer({
    schema: await createSchema()
  })

  return server
}
