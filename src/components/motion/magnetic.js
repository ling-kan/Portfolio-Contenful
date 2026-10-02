import React, { useRef } from 'react'
import useSafeReducedMotion from './use-safe-reduced-motion'
import { motion, useMotionValue, useSpring } from 'motion/react'

/**
 * Pulls its child gently towards the cursor while hovered.
 */
const Magnetic = ({ children, strength = 0.35, className = '' }) => {
  const ref = useRef(null)
  const reduce = useSafeReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 14, mass: 0.2 })
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 14, mass: 0.2 })

  if (reduce) return <span className={`inline-block ${className}`}>{children}</span>

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.span>
  )
}

export default Magnetic
