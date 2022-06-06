import React from 'react'
import { Link } from 'gatsby'
const Logo = ({ darkMode }) =>
    <Link to="/" className="flex items-center">
        <span className={`self-center text-2xl text-black dark:text-white font-semibold whitespace-nowrap uppercase tracking-wide`}>Ling kan</span>
    </Link>

export default Logo
