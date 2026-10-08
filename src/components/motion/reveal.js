import React from 'react'
import useSafeReducedMotion from './use-safe-reduced-motion'
import { motion } from 'motion/react'

export const EASE = [0.16, 1, 0.3, 1]

/**
 * Fades + lifts children into view once they enter the viewport.
 */
export const Reveal = ({ children, delay = 0, y = 12, className = '', as = 'div', once = true, amount = 0.1 }) => {
  const reduce = useSafeReducedMotion()
  const Tag = motion[as] || motion.div

  if (reduce) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.35, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

/**
 * Splits a string into words that slide up from behind a mask, one after another.
 * `highlight` words (case-insensitive) are rendered in the editorial serif accent.
 */
export const SplitText = ({ text = '', className = '', delay = 0, stagger = 0.02, as = 'span', highlight = [], animateOnMount = false }) => {
  const reduce = useSafeReducedMotion()
  const Tag = as
  const words = String(text).split(' ').filter(Boolean)
  const norm = (w) => w.replace(/[^\w'-]/g, '').toLowerCase()
  const highlighted = highlight.map(norm)

  const isHighlight = (word) => highlighted.includes(norm(word))

  if (reduce) {
    return (
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i} className={isHighlight(word) ? 'editorial text-accent' : undefined}>
            {word}{i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Tag>
    )
  }

  const trigger = animateOnMount
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, amount: 0.15 } }

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        {...trigger}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        className="inline"
      >
        {words.map((word, i) => (
          <span
            key={i}
            className={`inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]`}
          >
            <motion.span
              className={`inline-block ${isHighlight(word) ? 'editorial text-accent pr-[0.06em]' : ''}`}
              variants={{
                hidden: { y: '110%' },
                show: { y: '0%', transition: { duration: 0.35, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && ' '}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

/**
 * Staggers direct children into view. Wrap each child in <StaggerItem>.
 */
export const Stagger = ({ children, className = '', stagger = 0.03, delay = 0, as = 'div', amount = 0.1 }) => {
  const reduce = useSafeReducedMotion()
  const Tag = motion[as] || motion.div
  if (reduce) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {children}
    </Tag>
  )
}

export const StaggerItem = ({ children, className = '', as = 'div', y = 12 }) => {
  const reduce = useSafeReducedMotion()
  const Tag = motion[as] || motion.div
  if (reduce) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
      }}
    >
      {children}
    </Tag>
  )
}

export default Reveal
