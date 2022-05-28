import React from 'react'
import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'
import { motion } from "framer-motion"

class Template extends React.Component {
  render() {
    const { children, socials, navigation, location } = this.props
    const mainHeaderSpacing = (location?.pathname !== '/' && '64px')
    return (
      <div >
        <Seo />
        <Navigation navList={navigation} socialList={socials} />
        <motion.main
          initial={{
            opacity: 0,
            x: -200
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: 200
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
        <Footer navList={navigation} socialList={socials} />
      </div>
    )
  }
}

export default Template