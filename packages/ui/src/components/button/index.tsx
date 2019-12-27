/* eslint-disable @typescript-eslint/consistent-type-definitions */
import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { Action, colors } from '@/design'

const Sideline = styled.span<{ type: Action; right?: boolean }>`
  position: absolute;
  height: 100%;
  width: 4px;
  top: 0;

  background: ${p => colors.actions[p.type].gradient()};
  box-shadow: 0 0 5px
    ${p => colors.actions[p.type].shine.string()};

  ${p => (p.right ? 'left: 0;' : 'right: 0;')}
`

const bgColor = colors.background.body.fade(0.25)

const StyledButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 25px;
  border-radius: 3px;

  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito', sans-serif;

  color: ${colors.text.primary.string()};
  background: ${bgColor.string()};
  border: 0;

  overflow: hidden;
  cursor: pointer;

  transition: background 0.15s;

  &:hover {
    background: ${bgColor.lighten(0.5).string()};
  }
`

interface BaseButtonProps {
  action?: Action
  type?: 'submit'
  className?: string
  children: ReactNode
}

export interface ButtonProps extends BaseButtonProps {
  onClick: () => void
}

interface SubmitButtonProps extends BaseButtonProps {
  type: 'submit'
  onClick?: () => void
}

export const Button = ({
  action = 'primary',
  type,
  className,
  children,
  onClick,
}: ButtonProps | SubmitButtonProps) => {
  return (
    <StyledButton className={className} type={type} onClick={onClick}>
      <Sideline type={action} />

      {children}

      <Sideline right type={action} />
    </StyledButton>
  )
}
