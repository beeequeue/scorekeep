import React, { SelectHTMLAttributes } from 'react'
import styled from 'styled-components'
import { InputFieldStyle, Label } from '@/components/input-fields'

const SelectElement = styled.select`
  ${InputFieldStyle};
  border-color: #21e6c1;
`

export const Select = (props: SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <>
      <SelectElement required {...props} />
      <Label htmlFor={props.name}>{props.name}</Label>
    </>
  )
}
