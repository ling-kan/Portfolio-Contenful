import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'


const Hero = ({ image, title, content }) => (
  <div>
    {image && (
      <GatsbyImage alt={title} image={image} />
    )}
    <div >
      <h1 >{title}</h1>
      {content && <p >{content}</p>}
    </div>
  </div>
)

export default Hero
