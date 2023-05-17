module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,md,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,md,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        Barlow: ['var(--font-barlow)'],
        Poppins: ['var(--font-poppins)'],
        Mono: [
          'var(--fonts-jetbrains-mono)',
          'DejaVu Sans Mono',
          '-apple-system',
          'monospace',
        ],
        Lobster: ['var(--font-lobster)'],
      },
      colors: {
        bluish: {
          gray: 'rgba(245,247,250)',
        },
        rua: {
          gray: {
            100: '#aabfc5',
            600: 'rgb(66,66,66)',
            700: 'hsl(220, 13%, 18%)', // code background in dark
            800: 'rgb(35,38,38)', // card background in dark
            900: 'rgb(24,25,26)', // body background in dark
          },
        },
      },
      boxShadow: {
        outline: '0 0 0 3px rgba(83, 220, 246, 0.6)',
        underline: 'inset 0px -2px 0px 0px rgb(85 200 188 / 70%)',
        throughline: 'inset 0px -0.5em 0px 0px rgb(85 200 188 / 70%)',
      },
      backgroundImage: {
        underline: 'linear-gradient(rgb(240 240 240),rgb(240 240 240))',
        'underline-dark': 'linear-gradient(rgb(110 110 110),rgb(160 160 160))',
      },
    },
  },
  plugins: [],
};
