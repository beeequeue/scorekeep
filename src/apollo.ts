import { ApolloServer } from 'apollo-server-express'
import Express, { Express as IExpress } from 'express'
import Helmet from 'helmet'
import CookieParser from 'cookie-parser'

import { contextProvider } from '@/modules/session/session.lib'
import { createSchema } from '@/graphql'
import { router } from '@/router'

export const createApp = (): IExpress => {
  const app = Express()

  app.use(Helmet())
  app.use(CookieParser())

  app.use(router)

  return app
}

export const connectApolloServer = async (app: IExpress) => {
  const server = new ApolloServer({
    schema: await createSchema(),
    introspection: true,
    context: contextProvider,
  })

  server.applyMiddleware({ app })

  return server
}
