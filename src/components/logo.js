import React from 'react'
import { Link } from 'gatsby'
const Logo = ({ darkMode }) =>
    <Link to="/" className="flex items-center">
        <span className={`self-center text-2xl ${darkMode ? 'text-white' : 'text-secondary'} font-semibold whitespace-nowrap uppercase`}>Ling kan</span>
    </Link>

export default Logo
