import { buildSchema } from 'type-graphql'

export const createSchema = async () =>
  buildSchema({
    dateScalarMode: 'isoDate',
    resolvers: [],
  })
