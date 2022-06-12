import React from 'react'
import Container from './container'
import Header from './header'
import FadeIn from './motion/fade-in'

const TitleContainer = ({ title, subtitle, children, id }) => {
  return (
    <Container className=" grid grid-cols-1 lg:grid-cols-3 gap-8" id={id}>
      <div className="col-span-1">
        <FadeIn>
          <Header title={title} subtitle={subtitle} />
        </FadeIn >
      </div>
      <div className="col-span-2">
        <FadeIn>
          {children}
        </FadeIn >
      </div>
    </Container>
  )
}

export default TitleContainer
