import React from 'react'
import Container from './container'
import GithubIcon from "../assets/github.svg";
import MailIcon from "../assets/mail.svg";
import LinkedinIcon from "../assets/linkedin.svg";
import { Link } from 'gatsby'
import Logo from './logo';

const Footer = () => (
  <Container as="footer">
    <footer className="p-4 bg-white sm:p-6 dark:bg-gray-800">
      <div className="md:flex md:justify-between">
        <div className="mb-6 md:mb-0">
          <Logo />
        </div>
        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 ">
          <Link to="#" >
            <GithubIcon fill='white' className="w-8" />
          </Link>
          <Link to="#" >
            <MailIcon fill='white' className="w-8" />
          </Link>
          <Link to="#"  >
            <LinkedinIcon fill='white' className="w-8" />
          </Link>

        </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022 <Link to="/" className="hover:underline">Ling Kan Portfolio</Link>. All Rights Reserved.
        </span>

      </div>
    </footer>

  </Container>
)

export default Footer
