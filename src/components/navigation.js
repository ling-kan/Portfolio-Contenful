import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Container from './container';
import Logo from './logo';
import styled from "styled-components";
import Socials from './socials';
import { motion, AnimatePresence } from 'framer-motion';

const NavigationWrapper = styled.header`
  backdrop-filter: blur(5px);
  transition: box-shadow 0.3s ease, background-color 0.3s ease;
`;

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -20, height: 0 },
  visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, height: 0, transition: { duration: 0.2 } },
};

const Navigation = ({ navList }) => {
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerActive = scrolled || mobileNav;

  return (
    <NavigationWrapper
      className={`fixed top-0 w-full z-50 ${headerActive ? 'bg-primary-background shadow-md' : 'bg-transparent'}`}
      style={{ boxShadow: headerActive ? '0 2px 6px rgba(0,0,0,0.15)' : 'none' }}
      role="banner"
    >
      <Container as="nav" pageId="navigation">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <ul className="hidden sm:flex space-x-6 items-center">
            {navList?.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.url}
                  className="text-gray-700 hover:text-blue"
                  aria-current={index === 0 ? "page" : undefined}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            onClick={() => setMobileNav(!mobileNav)}
            className="sm:hidden flex items-center p-2 rounded-lg text-gray-700 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-200 z-50"
            aria-expanded={mobileNav}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Toggle menu</span>
            {!mobileNav ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu with animation */}
        <AnimatePresence>
          {mobileNav && (
            <motion.div
              key="mobile-menu"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              className="sm:hidden w-full bg-primary-background shadow-md overflow-hidden absolute left-0"
            >
              <ul className="flex flex-col py-3 px-4">
                {navList?.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.url}
                      className="block py-2 text-gray-700 hover:text-blue-500"
                      onClick={() => setMobileNav(false)}
                      aria-current={index === 0 ? "page" : undefined}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className='flex justify-start px-4 pb-3'>
                <Socials width="w-8" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </NavigationWrapper>
  );
};

export default Navigation;
