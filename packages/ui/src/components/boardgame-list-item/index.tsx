/* eslint-disable @typescript-eslint/consistent-type-definitions */
import React from 'react'
import styled, { css } from 'styled-components'
import { formatDistance } from 'date-fns'
import { Person, AccessTime } from 'styled-icons/material'
import { colors } from '@/design'

const Wrapper = styled.article`
  display: flex;
  justify-content: space-between;

  width: 100%;
  height: 60px;
`

const iconStyle = css`
  height: 18px;
  margin-right: 4px;
 margin-bottom:2px;
`
const Player = styled(Person)`
  ${iconStyle};
`

const Clock = styled(AccessTime)`
  ${iconStyle};
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Name = styled.h3`
  font-size: 20px;
  line-height: 20px;
  font-weight: 900;
  margin-bottom: 4px;
`

const SmallText = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.text.secondary.string()};
  font-size: 14px;
  line-height: 14px;
`

const Image = styled.img`
  height: 60px;
  width: 60px;
`

type Props = {
  name: string,
  players: [number, number],
  imageUrl: string,
  lastPlayed?: string
}
export const BoardgameListItem = ({name, imageUrl, players, lastPlayed}:Props) => {
  return (
    <Wrapper>
      <Info>
        <Name>
          {name}
        </Name>
        <SmallText>
          <Player />{players[0]} - {players[1]}
        </SmallText>
        <SmallText>
          <Clock />
          {lastPlayed ?
            `Last played ${formatDistance(new Date(lastPlayed), new Date())}`
            : "Never played"
          }
        </SmallText>
      </Info>
      <Image src={imageUrl}/>
    </Wrapper>
  )
}
