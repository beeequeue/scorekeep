import React from 'react'
import { hot } from 'react-hot-loader'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Section = styled.div`
  padding: 15px 25px;
  background: #0c0c0c;
  border-right: 2px solid;
  border-left: 2px solid;
  border-color: #78e22d;
`

const url = new URL(`${process.env.REACT_APP_SERVER_BASE_URL}/connect/google`)
url.searchParams.append('redirect_uri', location.href)

const Login = () => (
  <Container>
    <Section>
      <a href={url.toString()}>
        <button>Login/Register with Google</button>
      </a>
    </Section>
  </Container>
)

// eslint-disable-next-line import/no-default-export
export default hot(module)(Login)
