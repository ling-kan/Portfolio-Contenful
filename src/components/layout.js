import React from 'react'
import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'
import { useReducedMotion } from "framer-motion"
import HeaderList from './motion/header-list'
import useNavigationData from '../services/useNavigationData'
import CookieConsent from './cookie'

const Template = ({ children, fullHeaderHeight = false, data }) => {
  const navigation = useNavigationData();
  const prefersReducedMotion = useReducedMotion();
  const headerSpacing = fullHeaderHeight ? 'mt-0 md:mt-0' : 'mt-20 md:mt-16'

  return (
    <div >
      <Seo />
      <CookieConsent />
      <Navigation navList={navigation} />
      {prefersReducedMotion ?
        <main className={headerSpacing} role="main">{children}</main>
        :
        <HeaderList>
          <div className={headerSpacing} role="main">{children}</div>
        </HeaderList>
      }
      <Footer navList={navigation} />
    </div>
  )
}

export default Template
