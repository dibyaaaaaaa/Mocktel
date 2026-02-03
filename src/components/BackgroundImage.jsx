import React from 'react'
import background from "../assets/login1.jpg"
import styled from 'styled-components'

const BackgroundImage = () => {
  return (
    <Container>
        <img src={background} alt="Background" />
    </Container>
      
  )
}

export default BackgroundImage

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  img {
    height: 100%;
    width: 100%;
    `;
