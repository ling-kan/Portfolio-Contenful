import React from 'react'
import Container from './container'
import GithubIcon from "../assets/github.svg";
import MailIcon from "../assets/mail.svg";
import LinkedinIcon from "../assets/linkedin.svg";
import BuyACoffeeIcon from "../assets/buy-a-coffee.svg";
import { Link } from 'gatsby'
import Logo from './logo';

const Footer = ({ navList, socialList }) => (
  <div className="bg-dark text-gray-300 flex justify-center" >
    <Container as="footer">
      <div className="flex justify-center mb-2">
        <Logo darkMode={true} />
      </div>
      <div className="flex justify-center mb-2">
        {socialList?.map((value, index) => {
          return (
            <Link to={value.url} key={index} target="_blank">
              {value.type === 'Buy Me A Coffee' && <BuyACoffeeIcon className="w-6 fill-gray-300" />}
              {value.type === 'Github' && <GithubIcon className="w-6 fill-gray-300" />}
              {value.type === 'Email' && <MailIcon className="w-6 fill-gray-300" />}
              {value.type === 'Linkedin' && <LinkedinIcon className="w-6 fill-gray-300" />}
            </Link>
          )
        })}
      </div>
      <div className="flex justify-center mb-2">
        {navList?.map((value, index) => {
          return (
            <Link to={value.url} key={index} href="#responsive-header" activeClassName="active" className="mx-2" aria-current="page">{value.title}</Link>
          )
        })}
      </div>

      <span className="text-sm flex justify-center">© 2022&nbsp;<Link to="/" className="hover:underline">Ling Kan Portfolio</Link>. All Rights Reserved.</span>
    </Container>
  </div >
)

export default Footer
