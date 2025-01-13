import React from 'react'
import Container from './container'
import { Link } from 'gatsby'
import Logo from './logo';
import Socials from './socials';

const Footer = ({ navList }) => (
  <div className="flex justify-center pt-10" >
    <Container as="footer">
      <div className="sm:flex sm:justify-between">
        <div className="mb-6 sm:mb-0">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
        </div>
        <ul className={`sm:flex flex-col sm:flex-row sm:space-x-8 sm:text-sm sm:font-medium text-center`}>
          {navList?.map((value, index) => {
            return (
              <li key={index} className="my-2 sm:my-0">
                <Link to={value.url} activeClassName="active" className="mx-2" aria-current="page">{value.title}</Link>
              </li>
            )
          })}
        </ul>
      </div>
      <hr className="my-6 border-grey-light sm:mx-auto lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between sm:flex-row-reverse text-grey">
        <span className="text-xs md:text-sm block text-center">© 2024&nbsp;<Link to="/" className="hover:underline">Ling Kan Portfolio.</Link> All Rights Reserved.</span>
        <Socials width="w-8" />
      </div>
    </Container >
  </div >
)

export default Footer
