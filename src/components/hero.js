import React from 'react'
import Container from './container';

const Hero = ({ title, content }) => {
  return (
    <div className="grid grid-col-2 text-dark mt-6">
      <Container>
        <h1 className="text-5xl md:text-5xl" >{title}</h1>
        {content && <p className="text-1xl">{content}</p>}
      </Container>
    </div>
  )
}

export default Hero
