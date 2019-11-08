import React from 'react'
import ReactDOM from 'react-dom'
import { MockedProvider } from '@apollo/react-testing'

import Landing from './add'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <MockedProvider mocks={[]}>
      <Landing />
    </MockedProvider>,
    div,
  )
})
