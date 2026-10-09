import React from 'react';
import { Reveal } from './motion/reveal';

const Header = ({ title, subtitle, className = '' }) => {
  return (
    <div className='pt-0 lg:pb-8'>
        {title && (
          <Reveal as="h2" className={`${className} display-md text-ink`}>
            {title}
          </Reveal>
        )}
        {subtitle && <h3 className={`${title ? 'mt-4' : ''} font-display text-2xl md:text-3xl font-medium text-ink/75`}>{subtitle}</h3>}
    </div>
  )
}

export default Header
