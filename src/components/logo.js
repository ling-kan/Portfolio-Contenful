import React from 'react'
import { Link } from 'gatsby'

const Logo = ({ onClick, light = false }) => (
  <Link to="/" onClick={onClick} className={`group flex items-center gap-2.5 ${light ? '!text-paper' : '!text-ink'}`} aria-label="Ling Kan — home">
    <span className="relative grid place-items-center w-9 h-9 rounded-full bg-ink text-paper font-display font-bold text-sm tracking-tight overflow-hidden">
      <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      <span className="relative">LK</span>
    </span>
    <span className="font-display text-lg font-semibold tracking-tight whitespace-nowrap">
      Ling Kan<span className="text-accent">.</span>
    </span>
  </Link>
)

export default Logo
