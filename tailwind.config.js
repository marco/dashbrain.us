module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        '-1': '-1',
      },
      spacing: {
        4.5: '1.125rem',
        6.5: '1.625rem',
        56.5: '14.125rem',
        76: '19rem',
      },
      maxWidth: {
        '3/4': '75%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
