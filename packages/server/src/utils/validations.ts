import { ErrorObject } from 'ajv'
// eslint-disable-next-line node/no-extraneous-import
import { UserInputError } from 'apollo-server-errors'

export const createValidationError = (
  errors: ErrorObject[],
  message = 'Validation error!',
) =>
  new UserInputError(message, {
    validation: errors.map(error => {
      const path = error.dataPath
        .split('.')
        .map(p => p.split(/(\[\d+])/))
        .flat()
        .filter(Boolean)

      return {
        path,
        message: error.message,
      }
    }),
  })
