import React from 'react'
import Container from './container'
import Header from './header'
import FadeIn from './motion/fade-in'

const TitleContainer = ({ title, subtitle, children }) => {

  return (
    <FadeIn>
      <Container className=" grid grid-cols-1 md:grid-cols-3 gap-4 md:grid-cols-1">
        <div className="col-span-1">
          <Header title={title} subtitle={subtitle} />
        </div>
        <div className="col-span-2">
          {children}
        </div>
      </Container>
    </FadeIn >
  )
}

export default TitleContainer
