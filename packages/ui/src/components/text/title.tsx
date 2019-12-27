import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { Action, colors } from '@/design'

type ActionProps = {
  type?: Action
}

const StyledH1 = styled.h1`
  position: relative;
  display: inline-block;
  font-size: 32px;
  font-weight: 300;
  margin: 25px;
`

const Underline = styled.span<ActionProps>`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: ${p => colors.actions[p.type!].gradient(90)};
  box-shadow: 0 0 4px
    ${p => colors.actions[p.type!].highlight.fade(0.5).string()};
`

type Props = ActionProps & {
  marginTop?: number
  children: ReactNode
}

export const Title = ({ type = 'primary', marginTop, children }: Props) => {
  return (
    <StyledH1 style={{ marginTop }}>
      {children}

      <Underline type={type} />
    </StyledH1>
  )
}
