import React from 'react'
import { motion } from "framer-motion";

const HeaderList = ({ children }) => {
  return (
    <motion.main
      layout
      initial={{
        opacity: 0,
        y: -100
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{
        opacity: 0,
        y: 100
      }}
      transition={{
        type: "spring",
        mass: 0.5,
        stiffness: 50,
        duration: 0.1
      }}
    >
      {children}
    </motion.main>
  )
}

export default HeaderList;
