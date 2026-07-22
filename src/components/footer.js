import React from 'react'
import { Link } from 'gatsby'
import Socials from './socials';

const Footer = ({ navList }) => (
  <footer className="border-t border-border px-6 py-10 sm:px-12">
    <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <Link
        to="/"
        className="font-serif text-4xl font-semibold tracking-tight text-foreground"
      >
        LING KAN
      </Link>

      <nav>
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          {navList?.map((value, index) => (
            <li key={index}>
              <Link
                to={value.url}
                activeClassName="active"
                className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                aria-current="page"
              >
                {value.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Socials width="w-5" className="flex flex-wrap gap-x-8 gap-y-2" />
    </div>
    <div className="mx-auto mt-10 max-w-6xl border-t border-border pt-6">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        © 2025 Ling Kan Portfolio. All rights reserved. Refined for the modern web.
      </p>
    </div>
  </footer>
)

export default Footer
