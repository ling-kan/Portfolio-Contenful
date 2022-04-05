import React from 'react'
import { Link } from 'gatsby'


const Navigation = () => (
  <nav role="navigation" class="flex items-center justify-between flex-wrap  p-6">
    <div class="flex items-center flex-shrink-0  mr-6">
      <span class="font-semibold text-xl tracking-tight">LING KAN</span>
    </div>
    <div class="block sm:hidden">
      <button class="flex items-center px-3 py-2 border rounded text-black-200 border-black-400 hover:text-white hover:border-white">
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
      </button>
    </div>
    <div class="w-full block flex-grow sm:flex sm:items-center sm:w-auto">
      <div class="text-sm flex justify-end sm:flex-grow">
        <Link to="/" href="#responsive-header" activeClassName="active" class="block mt-4 lg:inline-block sm:mt-0 text-black-200 hover:text-black-400 ml-4">
          Home
        </Link>
        <Link to="/blog/" href="#responsive-header" activeClassName="active ml-4" class="block mt-4 sm:inline-block sm:mt-0 text-black-200 hover:text-black-400 ml-4">
          Blog
        </Link>
      </div>
    </div>
  </nav>
)

export default Navigation
