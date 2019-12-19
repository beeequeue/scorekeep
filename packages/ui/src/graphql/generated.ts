/* eslint-disable */
import gql from 'graphql-tag'
import * as ApolloReactCommon from '@apollo/react-common'
import * as ApolloReactHooks from '@apollo/react-hooks'
export type Maybe<T> = T | null

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any
}

export type Boardgame = {
  __typename?: 'Boardgame'
  uuid: Scalars['ID']
  type: Game_Type
  name: Scalars['String']
  /** Link to boardgamegeek */
  url: Maybe<Scalars['String']>
  rulebook: Maybe<Scalars['String']>
  minPlayers: Scalars['Int']
  maxPlayers: Scalars['Int']
  resultSchema: Scalars['JSONObject']
}

export type BoardgamesPage = {
  __typename?: 'BoardgamesPage'
  items: Array<Boardgame>
  nextOffset: Maybe<Scalars['Int']>
  total: Scalars['Int']
}

export type Club = {
  __typename?: 'Club'
  uuid: Scalars['ID']
  name: Scalars['String']
  members: Array<User>
  /** A club owner must be a claimed player */
  owner: User
}

export type Connection = {
  __typename?: 'Connection'
  uuid: Scalars['ID']
  type: ConnectionService
  user: User
  serviceId: Scalars['ID']
  email: Scalars['String']
  image: Scalars['String']
}

export enum ConnectionService {
  Google = 'GOOGLE',
}

export enum Game_Type {
  Collaborative = 'COLLABORATIVE',
  Competitive = 'COMPETITIVE',
}

export type Match = {
  __typename?: 'Match'
  uuid: Scalars['ID']
  club: Club
  players: Array<User>
  winners: Array<User>
  game: Boardgame
  results: Scalars['JSONObject']
  date: Scalars['DateTime']
}

export type Mutation = {
  __typename?: 'Mutation'
  addBoardgame: Boardgame
  addClub: Club
  addMatch: Match
  addUser: User
  useUser: Scalars['Boolean']
}

export type MutationAddBoardgameArgs = {
  minPlayers: Maybe<Scalars['Int']>
  rulebook: Maybe<Scalars['String']>
  type: Maybe<Game_Type>
  url: Maybe<Scalars['String']>
  resultSchema: Scalars['JSONObject']
  maxPlayers: Scalars['Int']
  name: Scalars['String']
}

export type MutationAddClubArgs = {
  name: Scalars['String']
}

export type MutationAddMatchArgs = {
  club: Maybe<Scalars['ID']>
  game: Scalars['ID']
  results: Scalars['JSONObject']
}

export type MutationAddUserArgs = {
  name: Scalars['String']
}

export type MutationUseUserArgs = {
  uuid: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  boardgame: Maybe<Boardgame>
  boardgames: BoardgamesPage
  club: Maybe<Club>
  match: Maybe<Match>
  user: Maybe<User>
  viewer: Maybe<User>
}

export type QueryBoardgameArgs = {
  uuid: Scalars['ID']
}

export type QueryBoardgamesArgs = {
  offset?: Maybe<Scalars['Int']>
  limit?: Maybe<Scalars['Int']>
}

export type QueryClubArgs = {
  uuid: Scalars['ID']
}

export type QueryMatchArgs = {
  uuid: Scalars['ID']
}

export type QueryUserArgs = {
  uuid: Scalars['ID']
}

export type User = {
  __typename?: 'User'
  uuid: Scalars['ID']
  name: Scalars['String']
  clubs: Array<Club>
  connections: Array<Connection>
  mainConnection: Maybe<Connection>
}

export type AddBoardgameMutationVariables = {
  name: Scalars['String']
  maxPlayers: Scalars['Int']
  minPlayers: Scalars['Int']
  schema: Scalars['JSONObject']
}

export type AddBoardgameMutation = { __typename?: 'Mutation' } & {
  addBoardgame: { __typename?: 'Boardgame' } & Pick<
    Boardgame,
    'uuid' | 'name' | 'resultSchema'
  >
}

export type UserQueryVariables = {}

export type UserQuery = { __typename?: 'Query' } & {
  viewer: Maybe<
    { __typename?: 'User' } & Pick<User, 'uuid' | 'name'> & {
        mainConnection: Maybe<
          { __typename?: 'Connection' } & Pick<
            Connection,
            'uuid' | 'type' | 'email' | 'image'
          >
        >
      }
  >
}

export type LoginConnectionsQueryVariables = {}

export type LoginConnectionsQuery = { __typename?: 'Query' } & {
  viewer: Maybe<
    { __typename?: 'User' } & Pick<User, 'uuid'> & {
        connections: Array<
          { __typename?: 'Connection' } & Pick<
            Connection,
            'uuid' | 'type' | 'email' | 'image'
          >
        >
      }
  >
}

export const AddBoardgameDocument = gql`
  mutation AddBoardgame(
    $name: String!
    $maxPlayers: Int!
    $minPlayers: Int!
    $schema: JSONObject!
  ) {
    addBoardgame(
      name: $name
      maxPlayers: $maxPlayers
      minPlayers: $minPlayers
      resultSchema: $schema
    ) {
      uuid
      name
      resultSchema
    }
  }
`
export type AddBoardgameMutationFn = ApolloReactCommon.MutationFunction<
  AddBoardgameMutation,
  AddBoardgameMutationVariables
>

/**
 * __useAddBoardgameMutation__
 *
 * To run a mutation, you first call `useAddBoardgameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBoardgameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBoardgameMutation, { data, loading, error }] = useAddBoardgameMutation({
 *   variables: {
 *      name: // value for 'name'
 *      maxPlayers: // value for 'maxPlayers'
 *      minPlayers: // value for 'minPlayers'
 *      schema: // value for 'schema'
 *   },
 * });
 */
export function useAddBoardgameMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddBoardgameMutation,
    AddBoardgameMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    AddBoardgameMutation,
    AddBoardgameMutationVariables
  >(AddBoardgameDocument, baseOptions)
}
export type AddBoardgameMutationHookResult = ReturnType<
  typeof useAddBoardgameMutation
>
export type AddBoardgameMutationResult = ApolloReactCommon.MutationResult<
  AddBoardgameMutation
>
export type AddBoardgameMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddBoardgameMutation,
  AddBoardgameMutationVariables
>
export const UserDocument = gql`
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

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UserQuery,
    UserQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    baseOptions,
  )
}
export function useUserLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UserQuery,
    UserQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    baseOptions,
  )
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>
export type UserQueryResult = ApolloReactCommon.QueryResult<
  UserQuery,
  UserQueryVariables
>
export const LoginConnectionsDocument = gql`
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

/**
 * __useLoginConnectionsQuery__
 *
 * To run a query within a React component, call `useLoginConnectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginConnectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginConnectionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoginConnectionsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    LoginConnectionsQuery,
    LoginConnectionsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    LoginConnectionsQuery,
    LoginConnectionsQueryVariables
  >(LoginConnectionsDocument, baseOptions)
}
export function useLoginConnectionsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    LoginConnectionsQuery,
    LoginConnectionsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    LoginConnectionsQuery,
    LoginConnectionsQueryVariables
  >(LoginConnectionsDocument, baseOptions)
}
export type LoginConnectionsQueryHookResult = ReturnType<
  typeof useLoginConnectionsQuery
>
export type LoginConnectionsLazyQueryHookResult = ReturnType<
  typeof useLoginConnectionsLazyQuery
>
export type LoginConnectionsQueryResult = ApolloReactCommon.QueryResult<
  LoginConnectionsQuery,
  LoginConnectionsQueryVariables
>
