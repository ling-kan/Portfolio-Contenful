import React from 'react'
import { motion } from "motion/react";
import { EASE } from './reveal'

// Page-level enter/exit transition
const HeaderList = ({ children }) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.main>
  )
}

export default HeaderList;
