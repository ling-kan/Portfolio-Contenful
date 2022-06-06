import React from 'react'
import { motion, useReducedMotion } from "framer-motion";
const FadeIn = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <> {prefersReducedMotion ?
      <div>{children} </div> :
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', duration: 3, staggerChildren: 0.5, stiffness: 20 }}
      >
        {children}
      </motion.div >}
    </>
  )
}

export default FadeIn;
