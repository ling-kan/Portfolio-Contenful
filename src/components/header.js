import React from 'react';

const Header = ({ title, dark }) => {
  return (
    <h2 className={`text-4xl md:text-4xl text-left xl:text-center pb-4 ${dark ? 'text-white' : 'text-black'}`}>{title}</h2>
  )
}

export default Header
