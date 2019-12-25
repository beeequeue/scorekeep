import React from 'react'
import { hot } from 'react-hot-loader'
import styled from 'styled-components'

import googleSvg from '@/assets/google.svg'
import { useUser } from '@/providers/user'
import { Title } from '@/components/text'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 65px;
`

const LoginButton = styled.a`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: 0;
  border: 0;
  transition: transform 0.1s;

  & > svg {
    height: 50px;
  }

  &:hover {
  transform: scale(1.05);
  }
`

const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  margin-bottom: 10px;

  & > img {
    height: 25px;
    margin-right: 10px;
    border-radius: 100%;
  }
`

const url = new URL(`${process.env.REACT_APP_SERVER_BASE_URL}/connect/google`)
url.searchParams.append('redirect_uri', location.href)

const Login = () => {
  const { user } = useUser()

  return (
    <Container>
      <Logo>Scorekeep</Logo>

      <Title marginTop={0}>Login / Register</Title>

      <LoginButton
        href={url.toString()}
        dangerouslySetInnerHTML={{ __html: googleSvg }}
      />

      {user && (
        <User>
          {user.mainConnection!.image && (
            <img src={user.mainConnection!.image}/>
          )}

          {user.name}
        </User>
      )}
    </Container>
  )
}

// eslint-disable-next-line import/no-default-export
export default hot(module)(Login)
