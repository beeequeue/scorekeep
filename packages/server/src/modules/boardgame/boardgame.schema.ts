import { JsonSchemaProperty } from '@/types/json-schema'

export const minimumResultsSchema: JsonSchemaProperty = {
  type: 'object' as const,
  required: ['type', 'required', 'properties'],
  properties: {
    type: {
      type: 'string',
      enum: ['object'],
    },
    required: {
      type: 'array' as const,
      minItems: 2,
      uniqueItems: true,
      items: [
        { type: 'string' as const, enum: ['player', 'winner'] },
        { type: 'string' as const, enum: ['player', 'winner'] },
      ],
      additionalItems: { type: 'string' as const },
    },
    properties: {
      type: 'object' as const,
      required: ['player', 'winner'],
      properties: {
        player: {
          type: 'object' as const,
          required: ['type'],
          properties: {
            type: {
              type: 'string' as const,
              enum: ['string'],
            },
          },
        },
        winner: {
          type: 'object' as const,
          required: ['type'],
          properties: {
            type: {
              type: 'string' as const,
              enum: ['boolean'],
            },
          },
        },
        additionalProperties: {
          type: 'object' as const,
          required: ['type'],
        },
      },
    },
  },
}

export type MinimumResultsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#'
  type: 'object'
  required: Array<'player' | 'winner' | 'score' | string>
  properties: {
    player: {
      type: 'string'
    }
    winner: {
      type: 'boolean'
    }
    final?: {
      type: 'number'
    }
    [key: string]: JsonSchemaProperty | undefined
  }
}

export type MinimumResults = Array<{
  player: string
  winner: boolean
  final?: number
}>
