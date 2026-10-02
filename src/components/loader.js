import React from 'react'
import RotatingBadge from './motion/rotating-badge'

// Shown while a protected case study checks access
const Loader = () => (
  <div className="fixed inset-0 bg-ink text-paper grid place-items-center" role="status" aria-label="Loading">
    <RotatingBadge text="LING KAN • PORTFOLIO • LOADING • " className="w-44 h-44">
      <span className="w-3 h-3 rounded-full bg-accent animate-ping" />
    </RotatingBadge>
  </div>
)

export default Loader
