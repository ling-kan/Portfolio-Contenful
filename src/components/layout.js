import React from 'react'
import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'
import { motion, useReducedMotion } from "framer-motion"

const Template = ({ children, socials, navigation, location }) => {
  const prefersReducedMotion = useReducedMotion();
  const mainHeaderSpacing = (location?.pathname !== '/' && '64px');
  return (
    <div >
      <Seo />
      <Navigation navList={navigation} socialList={socials} />
      {prefersReducedMotion ?
        <main style={{ marginTop: mainHeaderSpacing }} role="main">{children}</main>
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
          <main style={{ marginTop: mainHeaderSpacing }} role="main">{children}</main>
        </motion.main>
      }
      <Footer navList={navigation} socialList={socials} />
    </div>
  )
}

export default Template