import { Property } from '@/pages/boardgame/components/property-form'
import { isNil } from '@/utils'

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
  const propertyArray = Object.keys(formattedProperties)
    .map(name => `"${name}"`)
    .toString()

  return `
  { 
   "schema":{ 
      "$schema":"http://json-schema.org/draft-07/schema#",
      "type":"object",
      "required":[ 
         "playerResults"
      ],
      "properties":{ 
         "playerResults":{ 
            "type":"array",
            "required":[${propertyArray}],
            "items":{ 
               "type":"object",
               "required":[${propertyArray}],
               "properties":${JSON.stringify(formattedProperties)}
            }
         },
         "metaData":{ 
            "type":"object"
         }
      }
   }
}
`
}
