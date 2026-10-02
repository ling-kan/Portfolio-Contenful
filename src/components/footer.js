import React from 'react'
import { Link } from 'gatsby'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import Container from './container'
import Logo from './logo'
import Socials from './socials'
import useSiteSettings from '../services/useSiteSettings'

// Three equal columns keep the links truly centred regardless of the name/icon widths
const Footer = ({ navList }) => {
  const { footerCopyright } = useSiteSettings()
  return (
    <footer className="bg-ink text-paper border-t border-paper/10">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 text-center md:text-left">
          <div className="md:justify-self-start">
            <Logo light />
          </div>
          <nav aria-label="Footer" className="md:justify-self-center">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 p-0 m-0">
              {navList?.map((value) => (
                <li key={value.url} className="list-none">
                  <Link to={value.url} className="text-sm !text-paper/70 hover:!text-accent transition-colors">
                    {value.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex justify-center md:justify-end">
            <Socials width="w-6" iconClassName="fill-grey text-paper/70 hover:text-accent transition-colors" />
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-paper/65">
          <span>© {new Date().getFullYear()} {footerCopyright}</span>
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
}

export default Footer
