import { PropertyType } from '@/pages/boardgame/components/property-form'

const toPropertyType = (value: string): PropertyType => {
  const propertyTypes = [
    PropertyType.STRING,
    PropertyType.NUMBER,
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
