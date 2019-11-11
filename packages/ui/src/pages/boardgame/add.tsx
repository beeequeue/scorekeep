import React, { useState, useCallback } from 'react'
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

const Add = () => {
  const [propNumber, setPropNumber] = useState<number>(0)
  const [properties, setProperties] = useState<{
    [k: string]: Property | null
  }>({})
  const [name, setName] = useState('Azul')

  const updateProperty = useCallback(
    (propertyName, property) => {
      setProperties({
        ...properties,
        [propertyName]: property,
      })
    },
    [properties, setProperties],
  )

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
      schema: JSON.parse('{}'),
      name,
    }

    return addBoardgame({ variables })
  }, [addBoardgame, name])

  return (
    <>
      <h1>Add boardgame</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          submitBoardgame()
        }}
      >
        <input
          type="text"
          name="name"
          value={name}
          onChange={e => {
            setName(e.target.value)
          }}
        />
        <br />
        {Object.keys(properties).map(prop => (
          <ResultProperty key={prop} name={prop} onChange={updateProperty} />
        ))}
        <button onClick={addProperty}> Add Property</button>
        <input type="submit" value="Submit" />
      </form>
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default hot(module)(Add)
