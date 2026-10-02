import React from 'react'
import Container from './container'
import Header from './header'
import { Reveal } from './motion/reveal'

const TitleContainer = ({ title, subtitle, children, id, className = '' }) => {
  return (
    <Container className={`grid grid-cols-1 lg:grid-cols-3 gap-8 py-16 md:py-24 ${className}`} id={id}>
      <div className="col-span-1">
        <Header title={title} subtitle={subtitle} className="text-left" />
      </div>
      <div className="lg:col-span-2">
        <Reveal>{children}</Reveal>
      </div>
    </Container>
  )
}

export default TitleContainer
