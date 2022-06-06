import React from 'react'
import Container from './container'
import GithubIcon from "../assets/icons/github.svg";
import MailIcon from "../assets/icons/mail.svg";
import LinkedinIcon from "../assets/icons/linkedin.svg";
import BuyACoffeeIcon from "../assets/icons/buy-a-coffee.svg";
import { Link } from 'gatsby'
import Logo from './logo';

const Footer = ({ navList, socialList }) => (
  <div className="flex justify-center pt-10" >
    <Container as="footer">
      <div className="sm:flex sm:justify-between">
        <div className="mb-6 sm:mb-0">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
        </div>
        <ul className={`flex flex-col sm:flex-row sm:space-x-8 sm:text-sm sm:font-medium text-center`}>
          {navList?.map((value, index) => {
            return (
              <li key={index} className="my-2 sm:my-0">
                <Link to={value.url} href="#responsive-header" activeClassName="active" className="mx-2" aria-current="page">{value.title}</Link>
              </li>
            )
          })}
        </ul>
      </div>
      <hr className="my-6 border-grey-light sm:mx-auto lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between sm:flex-row-reverse text-grey">
        <span className="text-sm flex justify-center">© 2022&nbsp;<Link to="/" className="hover:underline">Ling Kan Portfolio</Link>. All Rights Reserved.</span>
        <ul className="flex space-x-6 justify-center">
          {socialList?.map((value, index) => {
            return (
              <li key={index} className="my-4 sm:my-0 ">
                <a href={value.url} target="_blank" rel="noreferrer">
                  {value.type === 'Buy Me A Coffee' && <BuyACoffeeIcon alt="Buy Me A Coffee'" className="w-8 fill-grey" />}
                  {value.type === 'Github' && <GithubIcon alt="Github" className="w-8 fill-grey" />}
                  {value.type === 'Email' && <MailIcon alt="Email" className="w-8 fill-grey" />}
                  {value.type === 'Linkedin' && <LinkedinIcon alt="Linkedin" className="w-8 fill-grey" />}
                </a>
              </li>
            )
          })}
        </ul>
      </div>




    </Container >
  </div >
)

export default Footer
