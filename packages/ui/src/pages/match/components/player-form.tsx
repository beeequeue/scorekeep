import React, { ChangeEvent, useCallback, useState, useEffect } from 'react'
import { getInput, PlayerDropdown } from '@/pages/match/components/inputs'
import styled from 'styled-components'
import { InputFieldContainer } from '@/components/input-fields'
import { PropertyType } from '@/pages/boardgame/components/property-form'

const Row = styled(InputFieldContainer)`
  margin-bottom: 32px;
`

const AddPlayer = styled.button`
  display: flex;
  width: 100%;
  padding: 0 16px;
  margin-bottom: 32px;
  height: 52px;
  border: 0;
  background: #004e7080;
  color: white;
  font-size: 20px;
  transition: background 200ms ease-in-out;

  &:hover {
    background: #004e70b3;
  }
`

const Player = styled.div`
  background-color: #004e70a0;
  position: relative;
  padding: 32px 16px 16px;
  margin-bottom: 16px;
`

const Close = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  font-size: 20px;
  line-height: 28px;
  background: transparent;
  color: #21e3c0e6;
  border: solid 1px #21e3c0e6;
  border-radius: 50%;
`

export const MatchForm = ({
                            schemaTypes,
  onChange,
  maxPlayers,
}: {
  schemaTypes: { [k: string]: PropertyType }
  maxPlayers: number
  onChange: (players: any) => void
}) => {

  const emptyResult = Object.keys(schemaTypes).reduce(
    (acc, type) => ({ ...acc, [type]: null }),
    {},
  )
  const [playerNumber, setPlayerNumber] = useState<number>(1)
  const [players, setPlayers] = useState<{
    [k: string]: any
  }>({ 'player-0': emptyResult })

  const updatePlayer = useCallback(
    (playerName, property) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setPlayers({
        ...players,
        [playerName]: {
          ...players[playerName],
          [property]: value,
        },
      })
    },
    [players, setPlayers],
  )
  const deletePlayer = (name: string) => () => {
    const filteredPlayers = Object.entries(players).filter(
      ([key]) => key !== name,
    )

    setPlayers(Object.fromEntries(filteredPlayers))
  }

  const addPlayer = () => {
    if (Object.keys(players).length >= maxPlayers) {
      return
    }
    setPlayers({ ...players, [`player-${playerNumber}`]: emptyResult })
    setPlayerNumber(playerNumber + 1)
  }

  useEffect(() => {
    onChange(Object.values(players))
  }, [players])
  return (
    <>
      {Object.keys(players).map(player => (
        <Player key={player}>
          {player !== 'player-0' && (
            <Close onClick={deletePlayer(player)}>X</Close>
          )}
          {Object.keys(players[player]).map(attribute => {
            if (attribute === 'player') {
              return (
                <Row key={attribute}>
                  <PlayerDropdown onChange={updatePlayer(player, 'player')} />
                </Row>
              )
            }

            const Component = getInput(schemaTypes[attribute])
            return (
              <Row key={attribute}>
                <Component
                  placeholder={attribute}
                  value={players[player][attribute]}
                  onChange={updatePlayer(player, attribute)}
                />
              </Row>
            )
          })}
        </Player>
      ))}
      <AddPlayer onClick={addPlayer}>+ Add Player</AddPlayer>
    </>
  )
}
