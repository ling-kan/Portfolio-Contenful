import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Socials from './socials';
import useSocialData from '../services/useSocialData';

const Navigation = ({ navList }) => {
  const [open, setOpen] = useState(false);
  const socials = useSocialData();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = open ? 'hidden' : '';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [open]);

  const desktopLinks = navList?.slice(0, 4) || [];
  const overlayLinks = navList?.filter((item) => item.url !== '/' && item.url !== '/#top' && item.url !== '#top') || navList?.slice(1) || [];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-5 sm:pt-7" role="banner">
        <nav className="flex w-full max-w-3xl items-center justify-between gap-4 rounded-full border border-border/70 bg-background/80 py-2 pl-6 pr-2 shadow-sm backdrop-blur-md">
          <Link
            to="/"
            className="font-serif text-lg font-semibold tracking-tight text-foreground"
          >
            LING KAN
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {desktopLinks.map((item, index) => (
              <Link
                key={index}
                to={item.url}
                className="text-xs font-medium uppercase tracking-[0.14em] text-foreground/70 transition-colors hover:text-foreground"
                aria-current={index === 0 ? "page" : undefined}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/#contact"
              className="hidden rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
            >
              Connect
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted md:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 bg-background transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 pt-8 sm:px-12">
          <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
            LING KAN
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground"
          >
            Close
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/40">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              </svg>
            </span>
          </button>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 pt-16 sm:px-12 lg:flex-row lg:items-center lg:gap-20 lg:pt-24">
          <div className="flex flex-1 flex-col">
            <ul className="flex flex-col gap-1">
              {overlayLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.url}
                    onClick={() => setOpen(false)}
                    className="font-serif text-6xl font-semibold leading-[1.05] tracking-tight text-foreground transition-opacity hover:opacity-60 sm:text-7xl lg:text-8xl"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              to="/#contact"
              onClick={() => setOpen(false)}
              className="mt-12 inline-flex w-fit items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Connect
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-border px-6 py-6 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground sm:px-12">
          <span>© 2025 Ling Kan</span>
          <div className="flex items-center gap-8">
            {socials?.map(({ type, url }, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {type}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
