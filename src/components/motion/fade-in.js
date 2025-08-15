import React from 'react'
import { motion, useReducedMotion } from "motion/react";
const FadeIn = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <> {prefersReducedMotion ?
      <div>{children} </div> :
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', duration: 1, staggerChildren: 0.5 }}
      >
        {children}
      </motion.div >}
    </>
  )
}

export default FadeIn;
