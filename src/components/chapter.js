import React from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { motion } from 'motion/react'
import Container from './container'
import { Reveal, SplitText, EASE } from './motion/reveal'

const TONES = {
  light: 'bg-paper text-ink',
  sand: 'bg-sand text-ink',
  dark: 'bg-ink text-paper',
}

/**
 * A numbered "chapter" of the story: eyebrow, kinetic heading, optional intro, then content.
 */
const Chapter = ({
  id,
  number,
  eyebrow,
  title,
  highlight = [],
  intro,
  aside,
  backdrop,
  tone = 'light',
  className = '',
  children,
}) => {
  const reduce = useSafeReducedMotion()
  const dark = tone === 'dark'

  return (
    <section id={id} className={`relative py-24 md:py-36 ${TONES[tone]} ${className}`}>
      {backdrop}
      <Container className="relative">
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 md:mb-20">
          <div className="lg:col-span-3">
            <div className={`eyebrow flex items-center gap-4 ${dark ? 'text-paper/60' : 'text-ink/60'}`}>
              {number && <span className="text-accent">{number}</span>}
              <motion.span
                aria-hidden="true"
                className={`h-px flex-1 max-w-16 origin-left ${dark ? 'bg-paper/30' : 'bg-ink/25'}`}
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE }}
              />
              <span>{eyebrow}</span>
            </div>
          </div>
          <div className="lg:col-span-9">
            {title && <SplitText as="h2" text={title} highlight={highlight} className="display-lg block" />}
            {intro && (
              <Reveal delay={0.2}>
                <p className={`lead mt-6 max-w-2xl ${dark ? 'text-paper/70' : 'text-ink/70'}`}>{intro}</p>
              </Reveal>
            )}
            {aside}
          </div>
        </header>
        {children}
      </Container>
    </section>
  )
}

export default Chapter
