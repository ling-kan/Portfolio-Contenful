import React from 'react';
import FadeIn from './motion/fade-in';
const Header = ({ title, span, className }) => {
  return (
    <FadeIn>
      <span className="text-md md:text-lg text-grey uppercase">{span}</span>
      <h2 className={`${className} text-4xl md:text-6xl text-left pt-0 pb-8 text-black`}>{title}</h2>
    </FadeIn>
  )
}

export default Header
