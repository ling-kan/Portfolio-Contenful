
import React, { useState } from 'react'
import { Link } from 'gatsby'
import Container from './container'
import Logo from './logo'
import styled from "styled-components"
import Socials from './socials';

const NavigationWrapper = styled.header`
background: linear-gradient( var(--background) 70%, transparent);
backdrop-filter: blur(1px);
`;

const Navigation = ({ navList }) => {
  const [mobileNav, setMobileNav] = useState(false);
  return (
    <NavigationWrapper className="my-auto fixed sm:inital z-10 top-0 w-full pin-l pin-t" role="banner">
      <Container as="nav" pageId="navigation">
        <div className={`${mobileNav ? 'bg-primary' : 'bg-primary-background'} sm:bg-transparent rounded-md p-3 flex flex-wrap justify-between items-center mx-auto`}>
          <div className="flex items-center text-black">
            <Logo />
          </div>
          <button data-collapse-toggle="mobile-menu" type="button" onClick={() => setMobileNav(!mobileNav)} className="inline-flex items-center p-2 ml-3 text-sm text-grey rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 border-none " aria-controls="mobile-menu" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
          <div className={`w-full sm:block sm:w-auto ${mobileNav ? 'block' : 'hidden'}`} id="mobile-menu">
            <ul className={`flex flex-col mt-4 sm:flex-row sm:space-x-8 sm:mt-0 sm:text-sm sm:font-medium`}>
              {navList?.map((value, index) => {
                return (
                  <li key={index}>
                    {index === 0 ?
                      <Link to={value.url} className="block my-2 mx-1  text-grey text-link" aria-current="page">{value.title}</Link>
                      :
                      <Link to={value.url} className="block my-2 mx-1  text-grey text-link">{value.title}</Link>
                    }
                  </li>
                )
              })}
            </ul>
            <div className='sm:hidden flex justify-around py-2'>
              <Socials width="w-8" />
            </div>
          </div>
        </div>
      </Container>

    </NavigationWrapper>
  )
}


export default Navigation
