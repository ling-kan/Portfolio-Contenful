import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useSafeReducedMotion from './use-safe-reduced-motion'
import { motion, useAnimationControls, useInView } from 'motion/react'

export const EASE = [0.16, 1, 0.3, 1]
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export const useRevealInView = (amount = 0.1) => {
  const ref = useRef(null)
  const inView = useInView(ref, { amount, once: true })
  const reduce = useSafeReducedMotion()
  const controls = useAnimationControls()
  const revealed = useRef(false)
  const [entered, setEntered] = useState(false)
  const [animated, setAnimated] = useState(false)

  useIsomorphicLayoutEffect(() => {
    controls.set(reduce ? 'show' : 'hidden')
  }, [controls, reduce])

  useEffect(() => {
    if (!inView || revealed.current) return
    revealed.current = true
    if (!reduce) {
      setAnimated(true)
      controls.start('show')
    } else {
      controls.set('show')
    }
    setEntered(true)
  }, [controls, inView, reduce])

  return { ref, controls, reduce, entered, animated }
}

/**
 * Reveals content once when it enters the viewport.
 */
export const Reveal = ({ children, delay = 0, y = 12, className = '', as = 'div', amount = 0.1 }) => {
  const { ref, controls, reduce } = useRevealInView(amount)
  const Tag = motion[as] || motion.div

  if (reduce) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag
      ref={ref}
      className={className}
      initial={false}
      animate={controls}
      transition={{ duration: 0.45, delay, ease: EASE }}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0 },
      }}
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
  const { ref, controls, reduce } = useRevealInView(0.15)
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

  return (
    <Tag ref={animateOnMount ? undefined : ref} className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={animateOnMount ? 'show' : controls}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        className="inline"
        variants={{
          hidden: {},
          show: {},
        }}
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
                show: { y: '0%', transition: { duration: 0.45, ease: EASE } },
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
  const { ref, controls, reduce } = useRevealInView(amount)
  const Tag = motion[as] || motion.div
  if (reduce) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }
  return (
    <Tag
      ref={ref}
      className={className}
      initial={false}
      animate={controls}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      variants={{
        hidden: {},
        show: {},
      }}
    >
      {children}
    </Tag>
  )
}

export const StaggerItem = ({ children, className = '', as = 'div', y = 12, duration = 0.45 }) => {
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
        show: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
      }}
    >
      {children}
    </Tag>
  )
}

export default Reveal
