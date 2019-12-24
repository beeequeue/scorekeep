import { PropertyType } from '@/pages/boardgame/components/property-form'
import { getTypesFromSchema } from './game-schema-types'

const schema = `{
      "$schema":"http://json-schema.org/draft-07/schema#",
      "type":"object",
      "required":[
         "playerResults"
      ],
      "properties":{
         "playerResults":{
            "type":"array",
            "required":["player","the-string"],
            "items":{
               "type":"object",
               "required":["player","the-number"],
               "properties":{"player":{"type":"string","pattern":"^[0-9a-fA-F]{8}\\\\-[0-9a-fA-F]{4}\\\\-[0-9a-fA-F]{4}\\\\-[0-9a-fA-F]{4}\\\\-[0-9a-fA-F]{12}$"},"the-number":{"type":"number"}}
            }
         },
         "metaData":{
            "type":"object"
         }
      }
   }`
describe('Utils for game schema', () => {
  test('returns an array of property name and type for a given schema', () => {
    const result = getTypesFromSchema(JSON.parse(schema))

    expect(result).toEqual({
      player: PropertyType.STRING,
      ['the-number']: PropertyType.NUMBER,
    })
  })
})
