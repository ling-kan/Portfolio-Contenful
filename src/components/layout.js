import React from 'react'

import '../styles/variables.css'
import '../styles/global.css'
import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'
import { ParallaxProvider } from 'react-scroll-parallax';


class Template extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div className='dark:bg-gray-800'>
        <ParallaxProvider>
          <Seo />
          <Navigation />
          <main>{children}</main>
          <Footer />
        </ParallaxProvider>
      </div>
    )
  }
}

export default Template