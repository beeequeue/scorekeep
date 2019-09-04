import React from 'react'
import { hot } from 'react-hot-loader'

import { useLocalization } from '@/hooks/localization'

const Landing = () => {
  const { number } = useLocalization()

  return (
    <>
      <div>Hello world!</div>

      <div style={{ color: 'cyan' }}>test</div>

      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i}>{number((i + 1) * 1_000_000)}</div>
      ))}
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default hot(module)(Landing)
