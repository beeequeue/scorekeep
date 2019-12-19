import React from 'react'
import { hot } from 'react-hot-loader'
import styled, { css } from 'styled-components'
import { Icon } from '@mdi/react'
import { mdiGoogle } from '@mdi/js'

import { useUser } from '@/providers/user'
import { useLoginConnectionsQuery } from '@/graphql/generated'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 25px;
  background: #0c0c0c;
  border-right: 2px solid;
  border-left: 2px solid;
  border-color: #78e22d;
`

const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  margin-bottom: 10px;

  ${(p: { main?: boolean }) =>
    p.main &&
    css`
      background: #222;
    `}

  & > img {
    height: 25px;
    margin-right: 10px;
    border-radius: 100%;
  }
`

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;
  border-radius: 5px;

  & > svg {
    margin-right: 5px;
  }
`

const url = new URL(`${process.env.REACT_APP_SERVER_BASE_URL}/connect/google`)
url.searchParams.append('redirect_uri', location.href)

const Login = () => {
  const { user } = useUser()

  const { data, loading } = useLoginConnectionsQuery({
    skip: user == null,
  })

  return (
    <Container>
      <Section>
        {user && (
          <User main>
            {user.mainConnection!.image && (
              <img src={user.mainConnection!.image} />
            )}

            {user.mainConnection!.email}
          </User>
        )}

        {user &&
          !loading &&
          data!.viewer!.connections.map(
            conn =>
              user.mainConnection!.uuid !== conn.uuid && (
                <User key={conn.uuid}>
                  {conn.image && <img src={conn.image} />}

                  {conn.email}
                </User>
              ),
          )}

        <a href={url.toString()}>
          <Button>
            {<Icon path={mdiGoogle} size={0.75} />}
            {user ? 'Connect a new account' : 'Login / Register'}
          </Button>
        </a>
      </Section>
    </Container>
  )
}

// eslint-disable-next-line import/no-default-export
export default hot(module)(Login)
