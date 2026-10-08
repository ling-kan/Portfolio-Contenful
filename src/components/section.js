import React from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { motion } from 'motion/react'
import Container from './container'
import { Reveal, SplitText, EASE, useDownwardReveal } from './motion/reveal'

const TONES = {
  light: 'bg-paper text-ink',
  sand: 'bg-sand text-ink',
  dark: 'bg-ink text-paper',
}

/**
 * A numbered home page section: eyebrow, kinetic heading, optional intro, then content.
 */
const Section = ({
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
  const { ref: ruleRef, controls: ruleControls } = useDownwardReveal()
  const dark = tone === 'dark'

  return (
    <section id={id} className={`relative py-24 md:py-36 ${TONES[tone]} ${className}`}>
      {backdrop}
      <Container className="relative">
        <header className="mb-14 md:mb-20 max-w-4xl">
          <div className="mb-6 md:mb-8">
            <div className={`eyebrow inline-flex items-center gap-4 ${dark ? 'text-paper/60' : 'text-ink/75'}`}>
              {number && <span className="text-accent">{number}</span>}
              <motion.span
                ref={ruleRef}
                aria-hidden="true"
                className={`h-px w-12 origin-left ${dark ? 'bg-paper/30' : 'bg-ink/25'}`}
                initial={reduce ? false : { scaleX: 0 }}
                animate={reduce ? { scaleX: 1 } : ruleControls}
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
                transition={{ duration: 0.45, ease: EASE }}
              />
              <span>{eyebrow}</span>
            </div>
          </div>
          <div>
            {title && <SplitText as="h2" text={title} highlight={highlight} className="display-lg block" />}
            {intro && (
              <Reveal delay={0.08}>
                <p className={`lead mt-6 max-w-2xl ${dark ? 'text-paper/70' : 'text-ink/75'}`}>{intro}</p>
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

export default Section
