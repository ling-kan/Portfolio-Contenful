import React from 'react'
import Container from './container'
import GithubIcon from "../assets/github.svg";
import WebsiteIcon from "../assets/website.svg";
import { Link } from 'gatsby'
const Footer = () => (
  <Container as="footer">
    <footer className="p-4 bg-white sm:p-6 dark:bg-gray-800">
      <div className="md:flex md:justify-between">
        <div className="mb-6 md:mb-0">
          <Link to="https://flowbite.com" className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
            <ul className="text-gray-600 dark:text-gray-400">
              <li className="mb-4">
                <Link to="https://flowbite.com" className="hover:underline">Flowbite</Link>
              </li>
              <li>
                <Link to="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
            <ul className="text-gray-600 dark:text-gray-400">
              <li className="mb-4">
                <Link to="https://github.com/themesberg/flowbite" className="hover:underline ">Github</Link>
              </li>
              <li>
                <Link to="https://discord.gg/4eeurUVvTy" className="hover:underline">Discord</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
            <ul className="text-gray-600 dark:text-gray-400">
              <li className="mb-4">
                <Link to="#" className="hover:underline">Privacy Policy</Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">Terms &amp; Conditions</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022 <Link to="https://flowbite.com" className="hover:underline">Flowbite™</Link>. All Rights Reserved.
        </span>
        <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">

          <Link to="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <GithubIcon />
          </Link>
          <Link to="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <WebsiteIcon />
          </Link>
        </div>
      </div>
    </footer>

  </Container>
)

export default Footer
