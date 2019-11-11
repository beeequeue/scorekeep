import React, { InputHTMLAttributes } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  display: block;
  height: 56px;
  width: 100%;
  margin-bottom: 16px;
`

const Label = styled.label`
  position: absolute;
  bottom: 12px;
  left: 9px;
  color: #b3b3b3;
  cursor: text;
  transition: all 0.2s ease-in-out;
`

const InputElement = styled.input`
  position: absolute;
  bottom: 0;
  display: block;
  height: 40px;
  width: 100%;
  font-size: 20px;
  color: white;
  line-height: 40px;
  border: 0;
  border-bottom: 1px solid #b3b3b3;
  outline: 0;
  padding: 0 8px;
  background-color: transparent;

  &::placeholder {
    color: transparent;
  }
  &:focus,
  &:not(:placeholder-shown) {
    border-bottom: 2px solid #21e6c1;
  }
  &:focus + label,
  &:not(:placeholder-shown) + label {
    bottom: 40px;
    left: 0;
    font-size: 14px;
    color: #21e6c1;
  }
`
export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <Container>
      <InputElement type="text" required {...props} />
      <Label htmlFor={props.placeholder}>{props.placeholder}</Label>
    </Container>
  )
}
