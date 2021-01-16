module.exports = {
  purge: ['./pages/**/*.tsx', './frontend/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        '-1': '-1',
      },
      spacing: {
        4.5: '1.125rem',
        6.5: '1.625rem',
        11: '2.75rem',
        56.5: '14.125rem',
        76: '19rem',
        120: '30rem',
      },
      maxWidth: {
        '3/4': '75%',
      },
      maxHeight: {
        '7/8': '87.5%',
      },
      colors: {
        'brand-blue': '#0054d2',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
