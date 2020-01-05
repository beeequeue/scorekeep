import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { HttpLink as _HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import LoggerLink from 'apollo-link-logger'
import { oc } from 'ts-optchain'

const ErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      // eslint-disable-next-line no-console
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )
  // eslint-disable-next-line no-console
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const HttpLink = new _HttpLink({
  uri: `${process.env.REACT_APP_SERVER_BASE_URL}/graphql`,
  credentials: 'include',
})

export const client = new ApolloClient({
  cache: new InMemoryCache({
    // {TypeName,UnknownType}(:{uuid,id})?
    dataIdFromObject: (obj: {
      __typename?: string
      id?: string
      uuid?: string
    }) => {
      const id = obj.uuid ?? obj.id
      return `${oc(obj).__typename('UnknownType')}${id ? `:${id}` : ''}`
    },
  }),
  link: ApolloLink.from([LoggerLink, ErrorLink, HttpLink]),
})
