import React from 'react';
import FadeIn from './motion/fade-in';
const Header = ({ title, subtitle, className }) => {
  return (
    <FadeIn>
      <div className='pt-0 lg:pb-8'>
        {title && <h2 className={`${className} text-3xl md:text-5xl text-left text-black dark:text-white`}>{title}</h2>}
        {subtitle && <h3 className={`${title && 'mt-8'} text-2xl md:text-3xl text-grey font-medium`}>{subtitle}</h3>}
      </div>
    </FadeIn>
  )
}

export default Header
