import React from 'react'
import styled from 'styled-components'
import { AnimatedList } from '@/components/animated-list'
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
    <AnimatedList>
      <BoardgameListItem
        name="Terraforming Mars"
        players={[1, 4]}
        imageUrl="https://cf.geekdo-images.com/itemrep/img/bhemoxL7PG1a_79L0D9syPTADSY=/fit-in/246x300/pic3536616.jpg"
        lastPlayed="2020-01-01"
      />
      <BoardgameListItem
        name="Scythe"
        players={[1, 8]}
        imageUrl="https://cf.geekdo-images.com/itemrep/img/gLHDC5bCrxd1JhefjJ-VxW2zC54=/fit-in/246x300/pic3163924.jpg"
        lastPlayed="2019-12-29"
      />
      <BoardgameListItem
        name="Azul"
        players={[2, 4]}
        imageUrl="https://cf.geekdo-images.com/itemrep/img/ql-0-t271LVGqbmWA1gdkIH7WvM=/fit-in/246x300/pic3718275.jpg"
        lastPlayed="2019-11-28"
      />
      <BoardgameListItem
        name="Gloomhaven"
        players={[1, 4]}
        imageUrl="https://cf.geekdo-images.com/itemrep/img/P7MVqNuhAl8Y4fxiM6e74kMX6e0=/fit-in/246x300/pic2437871.jpg"
      />
    </AnimatedList>
    </Container>
)
