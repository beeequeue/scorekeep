declare module 'apollo-link-logger' {
  import { ApolloLink } from 'apollo-link'

  const LoggerLink: ApolloLink
  // eslint-disable-next-line import/no-default-export
  export default LoggerLink
}
