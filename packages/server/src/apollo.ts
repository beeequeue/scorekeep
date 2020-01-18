import { ApolloServer } from 'apollo-server-express'
import { UserInputError } from 'apollo-server-errors'
import CookieParser from 'cookie-parser'
import Express, { Express as IExpress } from 'express'
import Helmet from 'helmet'
import { QueryFailedError } from 'typeorm'

import { config } from '@/config'
import { contextProvider } from '@/modules/session/session.lib'
import { createSchema } from '@/graphql'
import { router } from '@/router'
import { isNil } from '@/utils'

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
    engine: {
      rewriteError(err) {
        if (err instanceof UserInputError) {
          return null
        }

        return err
      },
      ...config.apolloEngine,
    },
    formatError(error) {
      // Workaround for apollo adding two UserInputError details for some reason
      if (error.extensions?.code === 'BAD_USER_INPUT') {
        const key = Object.keys(error.extensions.exception)?.[0]

        delete error.extensions[key]
      }

      if (!isNil(error.originalError)) {
        if (error.originalError.name !== 'Error') {
          error.message = `${error.originalError.name}: ${error.originalError.message}`
        }

        // Better query error message
        if (error.originalError instanceof QueryFailedError) {
          error.message = `${error.originalError.name}: ${
            (error.originalError as any)?.detail
          }`
        }
      }

      if (process.env.NODE_ENV === 'production') {
        if (!isNil(error.extensions)) {
          delete error.extensions.exception
        }
      }

      return error
    },
  })

  server.applyMiddleware({
    app,
    cors: {
      origin: [/^http:\/\/localhost/],
      credentials: true,
    },
  })

  return server
}
