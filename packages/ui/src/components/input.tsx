import React, { InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { InputFieldStyle, Label } from '@/components/input-fields'

const InputElement = styled.input`
  ${InputFieldStyle};
`
export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <>
      <InputElement type="text" required {...props} />
      <Label htmlFor={props.placeholder}>{props.placeholder}</Label>
    </>
  )
}
