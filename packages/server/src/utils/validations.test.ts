import { createValidationError } from './validations'

const typeError = (dataPath = 'results.playerResults[0].player') => ({
  keyword: 'type',
  dataPath,
  schemaPath: '#/properties/playerResults/items/properties/player/type',
  params: {
    type: 'string',
  },
  message: 'should be string',
})

test('createValidationError()', () => {
  const result = createValidationError([
    typeError('results.playerResults'),
    typeError(),
  ])

  expect({ ...result }).toMatchObject({
    extensions: {
      validation: [
        {
          message: 'should be string',
          path: ['results', 'playerResults'],
        },
        {
          message: 'should be string',
          path: ['results', 'playerResults', '[0]', 'player'],
        },
      ],
    },
  })
})
