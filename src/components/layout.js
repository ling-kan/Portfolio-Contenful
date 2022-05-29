import React from 'react'
import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'
import { motion, useReducedMotion } from "framer-motion"

const Template = ({ children, socials, navigation, fullHeaderHeight = false }) => {
  const prefersReducedMotion = useReducedMotion();
  const headerSpacing = fullHeaderHeight ? 'mt-0 md:mt-0' : 'mt-20 md:mt-16'
  return (
    <div >
      <Seo />
      <Navigation navList={navigation} socialList={socials} />
      {prefersReducedMotion ?
        <main className={headerSpacing} role="main">{children}</main>
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
          <div className={headerSpacing} role="main">{children}</div>
        </motion.main>
      }
      <Footer navList={navigation} socialList={socials} />
    </div>
  )
}

export default Template