import { PropertyType } from '@/pages/boardgame/components/property-form'

export const schema = JSON.parse(`
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
            "required":["player", "result"],
            "items":{ 
               "type":"object",
               "required":["player", "result"],
               "properties":{
                  "player": { "type": "string" },
                  "result": { "type": "number" },
                  "the-boolean": { "type": "boolean" }
               }
            }
         },
         "metaData":{ 
            "type":"object"
         }
      }
   }
}
`)

const toPropertyType = (value: string): PropertyType => {
  const propertyTypes = [
    PropertyType.STRING,
    PropertyType.NUMBER,
    PropertyType.BOOLEAN,
  ]

  return (
    propertyTypes.find(prop => prop.toLowerCase() === value) ||
    PropertyType.STRING
  )
}

export const getTypesFromSchema = (
  schema: any,
): { [k: string]: PropertyType } => {
  const properties: { [k: string]: { type: string } } =
    schema.properties.playerResults.items.properties

  return Object.keys(properties).reduce(
    (acc, property) => ({
      ...acc,
      [property]: toPropertyType(properties[property].type),
    }),
    {},
  )
}
