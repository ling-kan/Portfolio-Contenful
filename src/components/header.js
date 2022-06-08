import React from 'react';
import FadeIn from './motion/fade-in';
const Header = ({ title, subtitle, className }) => {
  return (
    <FadeIn>
      <subtitle className="text-md md:text-lg text-grey uppercase">{subtitle}</subtitle>
      <h2 className={`${className} text-4xl md:text-5xl text-left pt-0 pb-8 text-black`}>{title}</h2>
    </FadeIn>
  )
}

export default Header
