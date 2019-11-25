import React, { InputHTMLAttributes } from 'react'
import { Select } from '@/components/select'
import { PropertyType } from '@/pages/boardgame/components/property-form'
import { Input } from '@/components/input'
import styled from 'styled-components'

export const PlayerDropdown = () => (
  <Select name="Player">
    <option value="1">Adam</option>
    <option value="2">Angel</option>
    <option value="4">Other</option>
  </Select>
)

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
