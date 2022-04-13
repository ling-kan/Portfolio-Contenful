import React from 'react'
import { Link } from 'gatsby'
const Logo = ({ darkMode }) =>
    <Link to="/" className="flex items-center">
        <span className={`${darkMode ? "text-black dark:text-white" : ""} "self-center text-2xl font-semibold whitespace-nowrap uppercase"`}>Ling Kan</span>
    </Link>

export default Logo
