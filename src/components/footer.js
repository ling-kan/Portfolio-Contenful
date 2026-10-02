import React from 'react'
import { Link } from 'gatsby'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import Container from './container'
import Logo from './logo'
import Socials from './socials'

const Footer = ({ navList }) => (
  <footer className="bg-ink text-paper border-t border-paper/10">
    <Container className="py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <Logo light />
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 p-0 m-0">
            {navList?.map((value) => (
              <li key={value.url} className="list-none">
                <Link to={value.url} className="text-sm !text-paper/70 hover:!text-accent transition-colors">
                  {value.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Socials width="w-6" iconClassName="fill-grey text-paper/60 hover:text-accent transition-colors" />
      </div>
      <div className="mt-10 pt-6 border-t border-paper/10 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 text-xs text-paper/50">
        <span>© {new Date().getFullYear()} Ling Kan Portfolio. All rights reserved.</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group inline-flex items-center gap-2 !text-paper/70 hover:!text-paper"
        >
          Back to top
          <span className="grid place-items-center w-8 h-8 rounded-full border border-paper/20 group-hover:bg-accent group-hover:border-accent transition-colors">
            <ArrowUpIcon className="w-3.5 h-3.5 no-fill fill-paper group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </button>
      </div>
    </Container>
  </footer>
)

export default Footer
