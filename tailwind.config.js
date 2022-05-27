module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,json}",
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
    extend: {},
  },
  plugins: [],
}
