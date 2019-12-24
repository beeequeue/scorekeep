import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { colors } from '@/design'

const Sideline = styled.span<{ right?: boolean }>`
  position: absolute;
  height: 100%;
  width: 4px;
  top: 0;

  background: ${colors.highlights.gradients.main()};
  box-shadow: 0 0 3px ${colors.highlights.one}a0;
  transition: box-shadow 0.15s;

  ${p => (p.right ? 'left: 0;' : 'right: 0;')}
`

const StyledButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 25px;
  border-radius: 3px;

  font-size: 20px;
  font-weight: 400;
  font-family: 'Nunito', sans-serif;

  color: ${colors.text.primary};
  background: ${colors.background.secondary};
  border: 0;

  overflow: hidden;
  cursor: pointer;

  &:hover > ${Sideline} {
    box-shadow: 0 0 5px ${colors.highlights.one};
  }
`

export const Button = ({ children }: { children: ReactNode }) => {
  return (
    <StyledButton>
      <Sideline />

      {children}

      <Sideline right />
    </StyledButton>
  )
}
