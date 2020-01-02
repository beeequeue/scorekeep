import React from 'react'
import styled from 'styled-components'
import { BoardgameListItem } from '.'

export default {
  title: 'Boardgame List',
  component: BoardgameListItem,
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 25px;
  max-width: 375px;
`

export const main = () => (
  <Container>
    <BoardgameListItem name="Terraforming Mars" players={[1, 4]} imageUrl="https://cf.geekdo-images.com/itemrep/img/bhemoxL7PG1a_79L0D9syPTADSY=/fit-in/246x300/pic3536616.jpg" />
  </Container>
)
