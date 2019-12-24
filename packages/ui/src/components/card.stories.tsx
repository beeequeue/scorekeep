import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  Card,
  Title,
  GameName,
  StatBox,
  GenericInfo,
  PlayerBox,
  PlayerAvatar,
  BigInfo,
} from './card'

storiesOf('Button', module).add('with text', () => (
  <Card>
    <GenericInfo>
      <GameName>🕐 16-07-19</GameName>
      <GameName>Terraforming Mars</GameName>
    </GenericInfo>
    <Title>The winner</Title>
    <PlayerBox>
      <StatBox>
        <GameName>Players:</GameName>
        <PlayerBox>
          <PlayerAvatar />
          <PlayerAvatar />
          <PlayerAvatar />
          <PlayerAvatar />
        </PlayerBox>
      </StatBox>
      <StatBox>
        <GameName>Duration:</GameName>
        <BigInfo>115min</BigInfo>
      </StatBox>
      <StatBox>
        <GameName>Score:</GameName>
        <BigInfo>75 TP</BigInfo>
      </StatBox>
    </PlayerBox>
  </Card>
))
