import styled, { keyframes } from 'styled-components'


export const GenericInfo = styled.div`
  display: flex;
  justify-content: space-between;
`

export const PlayerBox = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const PlayerAvatar = styled.div`
  margin: 8px 2px 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
`

export const BigInfo = styled.div`
  font-size: 20px;
  line-height: 24px;
  font-weight: bold;
`

export const GameName = styled.h3`
  font-weight: 300;
  font-size: 12px;
  line-height: 16px;
  margin:0;
`
export const Title = styled.h2`
  font-size: 24px;
  line-height: 28px;
  font-weight: bold;
  margin: 16px 0;
  text-align: center;
`

export const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  
  text-align: center;
  padding: 8px 2px 0;
  &:not(:last-child) {
    border-right: solid 1px white;
  }
`

const Gradient = keyframes`
  0% {
      background-position: 0% 50%;
  }
  
  50% {
      background-position: 100% 50%;
  }
  100% {
      background-position: 0% 50%;
  }
`


// Palette https://colorhunt.co/palette/132247
export const Card = styled.div`
  position: relative;
  flex-direction: column;
  padding: 16px 16px 32px;
  
  border-radius: 0.5rem 1rem;
  border: solid 1px #278ea5;
  border-bottom: solid 4px white;
  
  background: linear-gradient(45deg, #3bdba3, #5a8fdf, #3bdba3, #5a8fdf);
  background-size: 400% 400%;
  animation: ${Gradient} 10s ease infinite;
`
