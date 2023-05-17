import { Lobster, Barlow, JetBrains_Mono, Poppins } from 'next/font/google';

export const lobster = Lobster({
  weight: ['400'],
  variable: '--font-lobster',
  subsets: ['latin'],
});

export const barlow = Barlow({
  weight: ['400', '500', '600'],
  variable: '--font-barlow',
  subsets: ['latin'],
});

export const jetbrains_mono = JetBrains_Mono({
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const poppins = Poppins({
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
  subsets: ['latin'],
});

const fonts = {
  lobster,
  barlow,
  jetbrains_mono,
  poppins,
};

export default fonts;
