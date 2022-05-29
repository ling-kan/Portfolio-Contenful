import React from 'react'
import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'
import { motion, useReducedMotion } from "framer-motion"

const Template = ({ children, socials, navigation, headerSpacing = "64px" }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div >
      <Seo />
      <Navigation navList={navigation} socialList={socials} />
      {prefersReducedMotion ?
        <main style={{ marginTop: headerSpacing }} role="main">{children}</main>
        :
        <motion.main
          layout
          initial={{
            opacity: 0,
            y: -150
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: 150
          }}
          transition={{
            type: "spring",
            mass: 0.5,
            stiffness: 100,
            duration: 0.1
          }}
        >
          <div style={{ marginTop: headerSpacing }} role="main">{children}</div>
        </motion.main>
      }
      <Footer navList={navigation} socialList={socials} />
    </div>
  )
}

export default Template