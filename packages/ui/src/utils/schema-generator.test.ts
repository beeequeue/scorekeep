import { generateSchemaFromProperties } from './schema-generator'
import { PropertyType } from '@/pages/boardgame/components/property-form'

describe('schema-generator', () => {
  test('generates schema for given properties with player field by default', () => {
    const properties = {
      ['property-0']: {
        type: PropertyType.NUMBER,
        name: 'the-number',
      },
    }

    const result = generateSchemaFromProperties(properties)

    expect(JSON.parse(result)).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      required: ['playerResults'],
      properties: {
        playerResults: {
          type: 'array',
          required: ['player', 'the-number'],
          items: {
            type: 'object',
            required: ['player', 'the-number'],
            properties: {
              player: {
                type: 'string',
                pattern:
                  '^[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}$',
              },
              'the-number': { type: 'number' },
            },
          },
        },
        metaData: {
          type: 'object',
        },
      },
    })
  })
})
