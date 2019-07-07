import { ApolloServer } from 'apollo-server-express'
import Express, { Express as IExpress } from 'express'

import { createSchema } from '@/graphql'
import { router } from '@/router'

export const createApp = (): IExpress => {
  const app = Express()

  app.use(router)

  return app
}

export const connectApolloServer = async (app: IExpress) => {
  const server = new ApolloServer({
    schema: await createSchema(),
    introspection: true,
  })

  server.applyMiddleware({ app })

  return server
}
