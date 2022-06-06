import React from 'react';

const Header = ({ title, span, className }) => {
  return (
    <div className="relative">
      <span className="text-lg text-grey uppercase">{span}</span>
      <h2 className={`${className} text-6xl text-left pt-0 pb-8 text-black`}>{title}</h2>

    </div>

  )
}

export default Header
