import { Property } from '@/pages/boardgame/components/property-form'
import { isNil } from '@/utils'

type PropertiesObject = { [k: string]: { type: string; pattern?: string } }
const SchemaTemplate = (properties: PropertiesObject) => ({
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    required: ['playerResults'],
    properties: {
      playerResults: {
        type: 'array',
        required: Object.keys(properties),
        items: {
          type: 'object',
          required: Object.keys(properties),
          properties,
        },
      },
      metaData: {
        type: 'object',
      },
    }
})
export const generateSchemaFromProperties = (properties: {
  [k: string]: Property | null
}) => {
  const formattedProperties = Object.values(properties).reduce(
    (acc, property) => {
      if (isNil(property)) {
        return acc
      }
      return {
        ...acc,
        [property.name]: { type: property.type.toLowerCase() },
      }
    },
    {
      player: {
        type: 'string',
        pattern:
          '^[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}$',
      },
    },
  )

  return JSON.stringify(SchemaTemplate(formattedProperties))
}
