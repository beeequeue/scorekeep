import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { colors } from '@/design'

const StyledH1 = styled.h1`
  position: relative;
  display: inline-block;
  font-size: 32px;
  font-weight: 300;
  margin: 25px;
`

const Underline = styled.span`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: ${colors.highlights.gradients.main};
  box-shadow: 0 0 3px ${colors.highlights.one}c0;
`

export const Title = ({ children, marginTop }: { children: ReactNode, marginTop?: number }) => {
  return (
    <StyledH1 style={{ marginTop }}>
      {children}

      <Underline />
    </StyledH1>
  )
}
