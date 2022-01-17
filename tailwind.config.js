module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bluish: {
          gray: 'rgba(245,247,250)',
        },
      },
      boxShadow: {
        outline: '0 0 0 3px rgba(83, 220, 246, 0.6)',
        underline: 'inset 0px -2px 0px 0px rgb(85 200 188 / 70%)',
        throughline: 'inset 0px -8px 0px 0px rgb(85 200 188 / 70%)',
      },
    },
  },
  plugins: [],
};
