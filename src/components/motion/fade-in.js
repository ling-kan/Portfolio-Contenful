import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from "motion/react";
const FadeIn = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || prefersReducedMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', duration: 1, staggerChildren: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

export default FadeIn;
