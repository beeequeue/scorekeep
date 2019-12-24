import React from 'react'
import { Button } from './index'
import styled from 'styled-components'

export default {
  title: 'Button',
  component: Button,
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  & > button:not(:last-child) {
    margin-right: 15px;
  }
`

export const main = () => (
  <Container>
    <Button>Cancel</Button>
    <Button>Continue</Button>
  </Container>
)
