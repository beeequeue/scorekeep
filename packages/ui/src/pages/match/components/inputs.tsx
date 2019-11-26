import React, { InputHTMLAttributes } from 'react'
import { Select } from '@/components/select'
import { PropertyType } from '@/pages/boardgame/components/property-form'
import { Input } from '@/components/input'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { PlayersQuery } from '@/graphql/generated'

const Players = gql`
    query players {
        users {
            uuid
            name
        }
    }
`

export const PlayerDropdown = () => {
  const { data, loading } = useQuery<PlayersQuery>(Players)

  if (loading || !data) {
    return null
  }

  const players = data.users ?? []
  return (<Select name="Player">
      {players.map(({uuid, name}) => <option value={uuid}>{name}</option>)}
  </Select>
)
}

const NumberInput = styled(Input).attrs({ type: 'number' })``

export const getInput = (
  type: PropertyType,
): React.FC<InputHTMLAttributes<HTMLInputElement>> => {
  switch (type) {
    case PropertyType.NUMBER:
      return NumberInput
    case PropertyType.STRING:
      return Input
    // TODO: Add more types like boolean
    default:
      return Input
  }
}
