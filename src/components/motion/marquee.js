import React from 'react'

/**
 * Infinite horizontal ticker. Content is duplicated so the loop is seamless.
 */
const Marquee = ({ children, duration = 40, gap = '3rem', reverse = false, className = '' }) => (
  <div
    className={`marquee ${reverse ? 'marquee--reverse' : ''} ${className}`}
    style={{ '--marquee-duration': `${duration}s`, '--marquee-gap': gap }}
  >
    <div className="marquee__track">{children}</div>
    <div className="marquee__track" aria-hidden="true">{children}</div>
  </div>
)

export default Marquee
