import React from 'react';

const Header = ({ title, dark, style }) => {
  return (
    <h2 style={style} className={`text-4xl md:text-4xl text-left xl:text-center pt-4 pb-8 ${dark ? 'text-white' : 'text-black'}`}>{title}</h2>
  )
}

export default Header
