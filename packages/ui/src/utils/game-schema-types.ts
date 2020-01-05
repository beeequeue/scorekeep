import { PropertyType } from '@/pages/boardgame/components/property-form'

const toPropertyType = (value: string): PropertyType => {
  const propertyTypes = [PropertyType.STRING, PropertyType.NUMBER]

  return (
    propertyTypes.find(prop => prop.toLowerCase() === value) ??
    PropertyType.STRING
  )
}

type Schema = {
  properties: {
    playerResults: any
  }
}

export const getTypesFromSchema = (
  schema: Schema,
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

const transformFunction = (type: PropertyType) => {
  if (type === PropertyType.NUMBER)
    return (x: string): number => parseInt(x, 10)
  return <T>(x: T): T => x
}
export const toSchemaType = (
  playerResults: [{ [k: string]: string }],
  schemaPropertyTypes: { [k: string]: PropertyType },
) =>
  playerResults.map(playerResult =>
    Object.keys(playerResult).reduce(
      (transformedResult, property) => ({
        ...transformedResult,
        [property]: transformFunction(schemaPropertyTypes[property])(
          playerResult[property],
        ),
      }),
      {},
    ),
  )
