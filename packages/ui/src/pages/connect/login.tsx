import React from 'react'
import { hot } from 'react-hot-loader'
import styled from 'styled-components'
import { Icon } from '@mdi/react'
import { mdiGoogle } from '@mdi/js'

import { useUser } from '@/hooks/user'

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
  margin-bottom: 10px;

  & > img {
    height: 25px;
    margin-right: 10px;
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

  return (
    <Container>
      <Section>
        {user && (
          <User>
            {user.mainConnection!.image && <img src={user.mainConnection!.image} />}

            {user.name}
          </User>
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
