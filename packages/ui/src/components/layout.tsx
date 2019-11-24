import React from 'react'
import styled, { css } from 'styled-components'

export const box = css`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 0.5rem;
  background-color: #1e2747;
`

const HeaderContainer = styled.div`
  grid-area: header;
  display: flex;
  align-items: center;
`

export const Header: React.FC = ({ children }) => (
  <HeaderContainer>
    <h1>{children}</h1>
  </HeaderContainer>
)

export const PageGrid = styled.div`
  display: grid;
  padding: 0 16px 16px;
  grid-template-columns: 1fr;
  grid-template-rows: 80px 1fr 1fr;
  grid-row-gap: 16px;

  grid-template-areas:
    'header'
    'main'
    'footer';
`
