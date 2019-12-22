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
import {
  AddMatchMutationVariables,
  Boardgame,
  BoardgamesQuery, useAddMatchMutation,
} from '@/graphql/generated'
import { getTypesFromSchema, toSchemaType } from '@/utils/game-schema-types'

const Row = styled(InputFieldContainer)`
  margin-bottom: 32px;
`

const Form = styled.form`
  ${box};
`

const Boardgames = gql`
  query Boardgames {
    boardgames {
        items {
            uuid
            maxPlayers
            name
            resultSchema
        }
    }
  }
`
const Add = () => {
  const [boardgame, setBoardgame] = useState<Pick<
    Boardgame,
    'uuid' | 'name' | 'resultSchema' | 'maxPlayers'
  > | null>(null)
  const { data, loading } = useQuery<BoardgamesQuery>(Boardgames)
  const [playerResults, setPlayerResults] = useState<any>(null)
  const [ addMatch ] = useAddMatchMutation()

  const onBoardgameChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (data) {
        const selectedBoardgame = (data.boardgames.items ?? []).find(
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
        onSubmit={async e => {
          e.preventDefault()
          const variables : AddMatchMutationVariables = {
            boardgame: boardgame!.uuid,
            result: {
              playerResults: toSchemaType(
                playerResults,
                getTypesFromSchema(boardgame!.resultSchema)
              )
            }
          }
          await addMatch({variables})

        }}
      >
        <Row>
          {boardgames?.items?.length > 0 && (
            <Select name="Boardgame" onChange={onBoardgameChange}>
              <option disabled selected>
                -- Select a boardgame --
              </option>
              {boardgames.items.map(({ uuid, name }) => (
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
              schemaTypes={getTypesFromSchema(boardgame.resultSchema)}
              maxPlayers={boardgame.maxPlayers}
              onChange={setPlayerResults}
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
