import React, { useState, useCallback, ChangeEvent } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import { InputFieldContainer } from '@/components/input-fields'

import { Button } from '@/components/button'
import { box, Header, PageGrid } from '@/components/layout'
import { Select } from '@/components/select'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { MatchForm } from '@/pages/match/components/player-form'
import { Boardgame, BoardgamesQuery } from '@/graphql/generated'

const Row = styled(InputFieldContainer)`
  margin-bottom: 32px;
`

const Form = styled.form`
  ${box};
`

const Boardgames = gql`
  query Boardgames {
    boardgames {
      uuid
      name
      resultSchema
    }
  }
`
const Add = () => {
  const [boardgame, setBoardgame] = useState<Pick<
    Boardgame,
    'uuid' | 'name' | 'resultSchema'
  > | null>(null)
  const { data, loading } = useQuery<BoardgamesQuery>(Boardgames)
  const [playersResults, setPlayersResults] = useState<any>(null)

  const onBoardgameChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (data) {
        const selectedBoardgame = (data.boardgames ?? []).find(
          bg => e.target.value === bg.uuid,
        )
        if (selectedBoardgame) {
          setBoardgame(selectedBoardgame)
        }
      }
    },
    [setBoardgame, data],
  )

  if (loading || !data) {
    return null
  }

  const { boardgames } = data

  return (
    <PageGrid>
      <Header>Add match</Header>
      <Form
        onSubmit={e => {
          e.preventDefault()
          return playersResults
        }}
      >
        <Row>
          {boardgames && boardgames.length > 0 && (
            <Select name="Boardgame" onChange={onBoardgameChange}>
              <option disabled selected>
                -- Select a boardgame --
              </option>
              {boardgames.map(({ uuid, name }) => (
                <option key={uuid} value={uuid}>
                  {name}
                </option>
              ))}
            </Select>
          )}
        </Row>
        {boardgame && (
          <>
            <MatchForm
              schema={boardgame.resultSchema}
              onChange={setPlayersResults}
            />
            <Button type="submit">Submit</Button>
          </>
        )}
      </Form>
    </PageGrid>
  )
}

// eslint-disable-next-line import/no-default-export
export default hot(module)(Add)
