import React from 'react';
import FadeIn from './motion/fade-in';

const Header = ({ title, subtitle, className }) => {
  return (
    <FadeIn>
      <div className="pt-0 lg:pb-8">
        {title && (
          <h2 className={`${className} font-serif text-5xl font-semibold italic tracking-tight text-foreground sm:text-6xl`}>
            {title}
          </h2>
        )}
        {subtitle && (
          <h3 className={`${title ? 'mt-4' : ''} flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground`}>
            {title && <span className="h-px w-8 bg-accent" />}
            {subtitle}
          </h3>
        )}
      </div>
    </FadeIn>
  )
}

export default Header
