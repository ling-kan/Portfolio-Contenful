import React from 'react'

import '../styles/variables.scss'
import '../styles/global.scss'
import '../styles/image.scss'
import '../styles/timeline.scss'


import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'

class Template extends React.Component {
  render() {
    const { children, socials, navigation } = this.props
    return (
      <div >
        <Seo />
        <Navigation navList={navigation} socialList={socials} />
        <main role="main">{children}</main>
        <Footer navList={navigation} socialList={socials} />
      </div>
    )
  }
}

export default Template