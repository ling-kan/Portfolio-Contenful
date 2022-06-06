import React from 'react';
import { motion } from "framer-motion";
const Header = ({ title, span, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', duration: 2 }}
      className="relative"
    >
      <span className="text-md md:text-lg text-grey uppercase">{span}</span>
      <h2 className={`${className} text-4xl md:text-6xl text-left pt-0 pb-8 text-black`}>{title}</h2>
    </motion.div>
  )
}

export default Header
