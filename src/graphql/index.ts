import { buildSchema } from 'type-graphql'

export const createSchema = async () =>
  await buildSchema({
    dateScalarMode: 'isoDate',
    resolvers: [],
  })
