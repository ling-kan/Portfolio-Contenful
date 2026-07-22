import React from 'react'
import Container from './container'
import Header from './header'
import FadeIn from './motion/fade-in'

const TitleContainer = ({ title, subtitle, children, id, className }) => {
  return (
    <section id={id} className={`px-6 pt-28 sm:px-12 sm:pt-36 ${className || ''}`}>
      <Container pageId="home" subtitle={!!subtitle} className="mx-auto max-w-6xl !p-0">
        {(title || subtitle) && (
          <div className="mb-10">
            <FadeIn>
              <Header title={title} subtitle={subtitle} className="text-left" />
            </FadeIn>
          </div>
        )}
        <FadeIn>
          {children}
        </FadeIn>
      </Container>
    </section>
  )
}

export default TitleContainer
