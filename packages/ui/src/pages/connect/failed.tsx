import React from 'react'
import { useLocation } from 'react-router'
import { hot } from 'react-hot-loader'
import styled from 'styled-components'
import { Icon } from '@mdi/react'
import { mdiGoogle } from '@mdi/js'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 25px;
  background: #0c0c0c;
  border-right: 2px solid;
  border-left: 2px solid;
  border-color: #e6322b;
`

const Service = styled(Icon).attrs({ color: '#eee', size: 1 })`
  margin-right: 8px;
`

const Failed = () => {
  const { search } = useLocation()

  const params = new URLSearchParams(search)

  return (
    <Container>
      <Section>
        {params.get('service') === 'GOOGLE' && <Service path={mdiGoogle} />}

        {params.get('code')!.replace(/_/g, ' ')}
      </Section>
    </Container>
  )
}

// eslint-disable-next-line import/no-default-export
export default hot(module)(Failed)
