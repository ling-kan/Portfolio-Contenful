import React from 'react'
import Container from './container'
import GithubIcon from "../assets/github.svg";
import MailIcon from "../assets/mail.svg";
import LinkedinIcon from "../assets/linkedin.svg";
import BuyACoffeeIcon from "../assets/buy-a-coffee.svg";
import { Link } from 'gatsby'
import Logo from './logo';

const Footer = ({ navList, socialList }) => (
  <div className="bg-primary flex justify-center pt-10" >
    <Container as="footer">
      <div className="md:flex md:justify-between">
        <div className="mb-6 md:mb-0">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
        </div>
        <ul className={`flex flex-col md:flex-row md:space-x-8 md:text-sm md:font-medium text-center`}>
          {navList?.map((value, index) => {
            return (
              <li key={index} className="my-2 md:my-0">
                <Link to={value.url} href="#responsive-header" activeClassName="active" className="mx-2" aria-current="page">{value.title}</Link>
              </li>
            )
          })}
        </ul>
      </div>
      <hr className="my-6 border-grey-light sm:mx-auto lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between sm:fekx sm:flex-row-reverse">
        <span className="text-sm flex justify-center">© 2022&nbsp;<Link to="/" className="hover:underline">Ling Kan Portfolio</Link>. All Rights Reserved.</span>
        <ul className="flex space-x-6 justify-center">
          {socialList?.map((value, index) => {
            return (
              <li key={index} className="my-4 md:my-0">
                <Link to={value.url} target="_blank">
                  {value.type === 'Buy Me A Coffee' && <BuyACoffeeIcon className="w-8 " />}
                  {value.type === 'Github' && <GithubIcon className="w-8 " />}
                  {value.type === 'Email' && <MailIcon className="w-8 " />}
                  {value.type === 'Linkedin' && <LinkedinIcon className="w-8 " />}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>




    </Container >
  </div >
)

export default Footer
