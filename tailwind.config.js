const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,json}", "./public/**/*.json", "./public/index.html",
  ],
  safelist: [
    {
      pattern: /col-(span)-(1|2|3|4|5|6)/,
      variants: ['md'],
    },
    {
      pattern: /grid-(cols|rows)-(1|2|3|4|5|6)/,
      variants: ['md'],
    },
  ],
  theme: {
    colors: {
      'primary': 'var(--primary)',
      'blue': 'var(--blue)',
      'blue-dark': 'var(--blue-dark)',
      'white': 'var(--white)',
      'black': 'var(--black)',
      'grey': 'var(--grey)',
      'grey-light': 'var(--grey-light)',
      'red': 'var(--red)',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
