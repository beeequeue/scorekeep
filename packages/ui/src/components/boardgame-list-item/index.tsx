import React from 'react'
import styled, { css } from 'styled-components'
import { formatDistanceStrict } from 'date-fns'
import { AccessTime, Person } from '@styled-icons/material'
import { colors } from '@/design'
import { isNil } from '@/utils'

const Wrapper = styled.article`
  display: flex;
  justify-content: space-between;

  width: 100%;
  height: 80px;
`

const iconStyle = css`
  height: 20px;
  margin-right: 4px;
  margin-left: -3px;
  margin-bottom: 2px;
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
  font-size: 24px;
  line-height: 20px;
  font-weight: 900;
  margin-bottom: 4px;
`

const SmallText = styled.div<{ hidden?: boolean }>`
  display: flex;
  align-items: center;
  color: ${colors.text.secondary.string()};
  font-size: 16px;
  line-height: 14px;
  visibility: ${p => (p.hidden ? 'hidden' : 'visible')};
`

const Image = styled.img`
  height: 80px;
  width: 80px;
  border-radius: 3px;
`

type Props = {
  name: string
  players: [number, number]
  imageUrl: string
  lastPlayed?: string
}

export const BoardgameListItem = ({
  name,
  imageUrl,
  players,
  lastPlayed,
}: Props) => {
  const dateStr =
    !isNil(lastPlayed) &&
    formatDistanceStrict(new Date(lastPlayed), new Date(), {
      addSuffix: true,
    })

  return (
    <Wrapper>
      <Info>
        <Name>{name}</Name>

        <SmallText>
          <Player />
          {players[0]} - {players[1]}
        </SmallText>

        <SmallText hidden={!dateStr}>
          <Clock />
          {dateStr && `Last played ${dateStr}`}
        </SmallText>
      </Info>

      <Image src={imageUrl} />
    </Wrapper>
  )
}
