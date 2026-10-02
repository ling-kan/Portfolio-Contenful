import React from 'react';
import { Reveal } from './motion/reveal';

const Header = ({ title, subtitle, className = '' }) => {
  return (
    <Reveal>
      <div className='pt-0 lg:pb-8'>
        {title && <h2 className={`${className} display-md text-ink`}>{title}</h2>}
        {subtitle && <h3 className={`${title ? 'mt-4' : ''} font-display text-2xl md:text-3xl font-medium text-ink/70`}>{subtitle}</h3>}
      </div>
    </Reveal>
  )
}

export default Header
