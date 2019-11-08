import React, { useState, useCallback } from 'react'
import { hot } from 'react-hot-loader'
import AceEditor from 'react-ace'
import Slider from 'rc-slider'
import styled from 'styled-components'
import { useMutation } from '@apollo/react-hooks'


import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-github'
import 'rc-slider/assets/index.css'

import { AddBoardgameMutationVariables, AddBoardgameMutation } from '@/graphql/generated'
import AddBoardgame from '@/graphql/add-boardgame.graphql'


const Range = Slider.createSliderWithTooltip(Slider.Range)

const Container = styled.div`
  width: 600px;
  height: 100px;
`
const Add = () => {
  const [JSONSchema, setJson] = useState()
  const [name, setName] = useState("Azul")
  const [range, setRange] = useState([1, 4])

  const [ addBoardgame ]  = useMutation<AddBoardgameMutation, AddBoardgameMutationVariables>(AddBoardgame)

  const submitBoardgame = useCallback(async () => {
    const [minPlayers, maxPlayers] = range
    const variables : AddBoardgameMutationVariables = {
      minPlayers,
      maxPlayers,
      schema: JSON.parse(JSONSchema),
      name
    }

    return addBoardgame({ variables})
  }, [addBoardgame, JSONSchema, range, name ])

  return (
    <>
      <h1>Hello world!</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          submitBoardgame()
        }}
      >
        <input type="text" name="name" value={name} onChange={(e) => {
          setName(e.target.value)
        }} />

        <Container>
          <Range min={1} max={15} defaultValue={[1, 4]} onChange={setRange}/>
        </Container>

        <AceEditor
          mode="json"
          theme="github"
          value={JSONSchema}
          onChange={code => setJson(code)}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
        <input type="submit" value="Submit" />
      </form>

    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default hot(module)(Add)
