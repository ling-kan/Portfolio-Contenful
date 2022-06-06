import React from 'react'
import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'
import { useReducedMotion } from "framer-motion"
import HeaderList from './motion/header-list'

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
        <HeaderList>
          <div className={headerSpacing} role="main">{children}</div>
        </HeaderList>
      }
      <Footer navList={navigation} socialList={socials} />
    </div>
  )
}

export default Template