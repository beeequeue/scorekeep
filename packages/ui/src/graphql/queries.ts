import gql from 'graphql-tag'

export const USER_QUERY = gql`
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

export const LOGIN_CONNECTIONS_QUERY = gql`
  query LoginConnections {
    viewer {
      uuid
      connections {
        uuid
        type
        email
        image
      }
    }
  }
`
