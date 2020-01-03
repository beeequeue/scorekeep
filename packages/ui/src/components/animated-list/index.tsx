import * as React from 'react'
import styled from 'styled-components'
import { useTrail, animated, OpaqueInterpolation } from 'react-spring'

const trailConfig = {
  config: { mass: 5, tension: 1200, friction: 120 },
  opacity: 1,
  x: 0,
  from: { opacity: 0, x: 300 },
  delay: 500,
}

const ListComponent = styled.div`
  width: 100%;
  & > * {
    margin-bottom: 14px;
  }
`

export const AnimatedList : React.FC = ({children} ) => {
  const elements = Array.isArray(children) ? children : [children]
  const trail = useTrail(elements.length, trailConfig)
  return (
    <ListComponent>
      {trail.map(({ x, ...rest }, index) => (
        <animated.div
          key={index}
          style={{
            ...rest, transform: (x as OpaqueInterpolation<number>).interpolate(x => `translate3d(0,${x}px,0)`)
          }}>
          {elements[index]}
        </animated.div>
      ))}
    </ListComponent>
  )
}
