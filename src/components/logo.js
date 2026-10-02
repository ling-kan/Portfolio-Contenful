import React from 'react'
import { Link } from 'gatsby'

// Text wordmark only (no logo mark)
const Logo = ({ onClick, light = false }) => (
  <Link
    to="/"
    onClick={onClick}
    className={`font-display text-base font-semibold tracking-[0.04em] whitespace-nowrap ${light ? '!text-paper' : '!text-ink'}`}
    aria-label="Ling Kan — home"
  >
    LING KAN<span className="text-accent">.</span>
  </Link>
)

export default Logo
