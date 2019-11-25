import React, { InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { InputFieldStyle, Label } from '@/components/input-fields'

const InputElement = styled.input`
  ${InputFieldStyle};
`
export const Input = ({
  type,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <>
      <InputElement required type={type || 'text'} {...props} />
      <Label htmlFor={props.placeholder}>{props.placeholder}</Label>
    </>
  )
}
