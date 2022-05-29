import React from 'react';

const Header = ({ title, dark, className }) => {
  return (
    <h2 className={`${className} md:text-center text-4xl text-left pt-4 pb-8 ${dark ? 'text-white' : 'text-black'}`}>{title}</h2>
  )
}

export default Header
