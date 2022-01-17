module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
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
      },
    },
  },
  plugins: [],
};
