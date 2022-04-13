import React from 'react'

import '../styles/variables.scss'
import '../styles/global.scss'
import '../styles/image.scss'
import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'

class Template extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div >
        <Seo />
        <Navigation />
        <main role="main">{children}</main>
        <Footer />
      </div>
    )
  }
}

export default Template