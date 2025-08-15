import defaultTheme from "tailwindcss/defaultTheme";
module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx,json,scss}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/styles/**/*.{css,scss}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.json",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        blue: 'var(--blue)',
        'blue-dark': 'var(--blue-dark)',
        white: 'var(--white)',
        black: 'var(--black)',
        'grey': 'var(--grey)',
        'grey-light': 'var(--grey-light)',
        red: 'var(--red)',
        background: 'var(--background)',
        border: 'var(--border)',
        link: 'var(--link)',
        'link-hover': 'var(--link-hover)',
      },
      spacing: {
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontSize: {
        xs: ['var(--text-xs)', { lineHeight: 'var(--solid)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--dense)' }],
        md: ['var(--text-md)', { lineHeight: 'var(--default)' }],
        lg: ['var(--text-lg)', { lineHeight: 'var(--default)' }],
        xl: ['var(--text-xl)', { lineHeight: 'var(--default)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--default)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--default)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--default)' }],
        '5xl': ['var(--text-5xl)', { lineHeight: 'var(--default)' }],
        '6xl': ['var(--text-6xl)', { lineHeight: 'var(--default)' }],
      },
      lineHeight: {
        solid: 'var(--solid)',
        dense: 'var(--dense)',
        default: 'var(--default)',
        loose: 'var(--loose)',
      },
      fontWeight: {
        body: 'var(--body)',
        medium: 'var(--medium)',
        semibold: 'var(--semibold)',
        bold: 'var(--bold)',
        extrabold: 'var(--extrabold)',
        heavy: 'var(--heavy)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        serif: 'var(--font-serif)',
        mono: 'var(--font-monospace)',
      },
      screens: {
        xs: '480px',   // $xs-mq
        sm: '640px',   // $sm-mq
        md: '768px',   // $md-mq
        lg: '1024px',  // $lg-mq
        xl: '1280px',  // $xl-mq
        '2xl': '1536px', // $xxl-mq
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
