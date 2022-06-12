import React from 'react';
import FadeIn from './motion/fade-in';
const Header = ({ title, subtitle, className }) => {
  return (
    <FadeIn>
      <subtitle className="text-md md:text-lg text-grey uppercase font-medium">{subtitle}</subtitle>
      <h2 className={`${className} text-4xl md:text-5xl text-left pt-0 lg:pb-8 text-black dark:text-white`}>{title}</h2>
    </FadeIn>
  )
}

export default Header
