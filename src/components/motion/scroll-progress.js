import React from 'react'
import { motion, useScroll, useSpring } from 'motion/react'

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] bg-accent origin-left z-[60]"
      style={{ scaleX }}
    />
  )
}

export default ScrollProgress
