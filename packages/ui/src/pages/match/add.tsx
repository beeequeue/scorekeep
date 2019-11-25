import React, { useState, useCallback, ChangeEvent } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import { InputFieldContainer } from '@/components/input-fields'

import { Button } from '@/components/button'
import { box, Header, PageGrid } from '@/components/layout'
import { Select } from '@/components/select'
import { getTypesFromSchema, schema } from '@/pages/match/getTypesFromSchema'
import { getInput, PlayerDropdown } from '@/pages/match/components/inputs'

const Row = styled(InputFieldContainer)`
  margin-bottom: 32px;
`

const Form = styled.form`
  ${box};
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

const Add = () => {
  const [playerNumber, setPlayerNumber] = useState<number>(1)

  // This should come from the graphql
  const schemaResultTypes = getTypesFromSchema(schema)
  const emptyResult = Object.keys(schemaResultTypes).reduce(
    (acc, type) => ({ ...acc, [type]: null }),
    {},
  )
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
    setPlayers({ ...players, [`player-${playerNumber}`]: emptyResult })
    setPlayerNumber(playerNumber + 1)
  }

  const addMatch = useCallback(async () => {}, [name, players])

  return (
    <PageGrid>
      <Header>Add match</Header>
      <Form
        onSubmit={e => {
          e.preventDefault()
          addMatch()
        }}
      >
        <Row>
          <Select name="Boardgame">
            <option value="azul">Azul</option>
            <option value="7wonders">7 wonders</option>
          </Select>
        </Row>
        {Object.keys(players).map(player => (
          <Player key={player}>
            <Close onClick={deletePlayer(player)}>X</Close>
            {Object.keys(players[player]).map(attribute => {
              if (attribute === 'player') {
                return (
                  <Row key={attribute}>
                    <PlayerDropdown />
                  </Row>
                )
              }

              const Component = getInput(schemaResultTypes[attribute])
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
        <Button type="submit">Submit</Button>
      </Form>
    </PageGrid>
  )
}

// eslint-disable-next-line import/no-default-export
export default hot(module)(Add)
