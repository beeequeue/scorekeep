import { JsonSchemaProperty } from '@/types/json-schema'

export const minimumResultsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#' as const,
  type: 'object' as const,
  required: ['player' as const, 'winner' as const, 'score' as const],
  properties: {
    player: {
      type: 'string' as const,
    },
    winner: {
      type: 'boolean' as const,
    },
    final: {
      type: 'number' as const,
    } as { type: 'number' } | undefined,
  },
}

export type MinimumResultsSchema = typeof minimumResultsSchema & {
  properties: {
    [key: string]:
      | JsonSchemaProperty
      | undefined
  }
}

export type MinimumResults = Array<{
  player: string
  winner: boolean
  final?: number
}>
