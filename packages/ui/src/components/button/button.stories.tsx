import React from 'react'
import styled from 'styled-components'
import { colors } from '@/design'
import { Button } from '.'

export default {
  title: 'Button',
  component: Button,
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 25px;

  & > div > button:not(:last-child) {
    margin-right: 15px;
  }
`

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  margin-top: 15px;
  background: ${colors.background.primary.string()};
  border-radius: 3px;
`

const noop = () => {
  /* no-op */
}

export const main = () => (
  <Container>
    <div>
      <Button onClick={noop}>Cancel</Button>
      <Button onClick={noop}>Continue</Button>
    </div>

    <InnerContainer>
      <Button action="danger" onClick={noop}>Delete</Button>
      <Button onClick={noop}>Continue</Button>
    </InnerContainer>
  </Container>
)
