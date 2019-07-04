export const cleanupDatabases = () => Promise.all([])

export const assertObjectEquals = <T extends {}>(result: T, user: T) => {
  expect(JSON.stringify(result, null, 2)).toEqual(JSON.stringify(user, null, 2))
}
