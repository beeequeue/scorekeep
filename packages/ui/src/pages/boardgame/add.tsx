import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import { useMutation } from '@apollo/react-hooks'
import {
  AddBoardgameMutationVariables,
  AddBoardgameMutation,
} from '@/graphql/generated'
import AddBoardgame from '@/graphql/add-boardgame.graphql'
import {
  Property,
  ResultProperty,
} from '@/pages/boardgame/components/property-form'
import { generateSchemaFromProperties } from '@/pages/boardgame/generateSchemaValidation'
import { InputFieldContainer } from '@/pages/boardgame/components/input-fields'
import { Input } from './components/input'

const PlayerNumberInput = styled(Input).attrs({
  type: 'number',
  min: 1,
  max: 12,
})`
  width: 48px;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 32px;
`

const NameContainer = styled(InputFieldContainer)`
  flex: 1;
`
const MinMaxContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`

const NumberInputContainer = styled(InputFieldContainer)`
  width: 25%;
`

const Add = () => {
  const [propNumber, setPropNumber] = useState<number>(1)
  const [properties, setProperties] = useState<{
    [k: string]: Property | null
  }>({ 'property-0': null })
  const [name, setName] = useState('Azul')
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(12)

  const updateProperty = useCallback(
    (propertyName, property) => {
      setProperties({
        ...properties,
        [propertyName]: property,
      })
    },
    [properties, setProperties],
  )
  const deleteProperty = (name: string) => {
    const filteredProperties = Object.entries(properties).filter(
      ([key]) => key !== name,
    )
    setProperties(Object.fromEntries(filteredProperties))
  }

  const addProperty = () => {
    setProperties({ ...properties, [`property-${propNumber}`]: null })
    setPropNumber(propNumber + 1)
  }

  const [addBoardgame] = useMutation<
    AddBoardgameMutation,
    AddBoardgameMutationVariables
  >(AddBoardgame)

  const submitBoardgame = useCallback(async () => {
    const [minPlayers, maxPlayers] = [1, 4]
    const variables: AddBoardgameMutationVariables = {
      minPlayers,
      maxPlayers,
      schema: JSON.parse(generateSchemaFromProperties(properties)),
      name,
    }

    return addBoardgame({ variables })
  }, [addBoardgame, name, properties])

  return (
    <>
      <h1>Add boardgame</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          submitBoardgame()
        }}
      >
        <Row>
          <NameContainer>
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => {
                setName(e.target.value)
              }}
            />
          </NameContainer>
          <MinMaxContainer>
            <NumberInputContainer>
              <PlayerNumberInput
                placeholder="Min"
                value={min}
                onChange={e => {
                  setMin(parseInt(e.target.value))
                }}
              />
            </NumberInputContainer>
            <NumberInputContainer>
              <PlayerNumberInput
                placeholder="Max"
                value={max}
                onChange={e => {
                  setMax(parseInt(e.target.value))
                }}
              />
            </NumberInputContainer>
          </MinMaxContainer>
        </Row>
        {Object.keys(properties).map(prop => (
          <ResultProperty
            key={prop}
            name={prop}
            onDelete={deleteProperty}
            onChange={updateProperty}
            removable={prop !== 'property-0'}
          />
        ))}
        <button onClick={addProperty}> Add Property</button>
        <input type="submit" value="Submit" />
      </form>
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default hot(module)(Add)
