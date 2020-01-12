/* eslint-disable */

export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string
      name: string
      possibleTypes: {
        name: string
      }[]
    }[]
  }
}
const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: 'UNION',
        name: 'UsersUnion',
        possibleTypes: [
          {
            name: 'User',
          },
          {
            name: 'UnclaimedUser',
          },
        ],
      },
    ],
  },
}
export default result
