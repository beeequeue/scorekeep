import { resolve } from 'path'
import { buildSchema } from 'type-graphql'
import { authChecker } from '@/graphql/auth'

export const createSchema = async (generateSnapshot = true) =>
  buildSchema({
    emitSchemaFile:
      !generateSnapshot || process.env.NODE_ENV === 'test'
        ? false
        : { path: resolve(__dirname, 'snapshot.graphql') },
    dateScalarMode: 'isoDate',
    resolvers: [(resolve(__dirname, '../modules/**/*.resolvers.ts'))],
    authChecker,
  })
