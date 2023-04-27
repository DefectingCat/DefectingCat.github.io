import {
  Aleo,
  Aref_Ruqaa,
  Barlow,
  JetBrains_Mono,
  Poppins,
} from 'next/font/google';

export const aleo = Aleo({
  weight: ['300', '400', '700'],
  variable: '--font-aleo',
  display: 'swap',
  subsets: ['latin'],
});

export const aref_ruqaa = Aref_Ruqaa({
  weight: ['400', '700'],
  variable: '--font-aref-ruqaa',
  display: 'swap',
  subsets: ['latin'],
});

export const barlow = Barlow({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow',
  display: 'swap',
  subsets: ['latin'],
});

export const jetbrains_mono = JetBrains_Mono({
  display: 'swap',
  weight: ['300', '400', '700'],
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const poppins = Poppins({
  weight: ['300', '400', '700', '100', '200', '500', '600', '800', '900'],
  variable: '--font-poppins',
  subsets: ['latin'],
});

const fonts = {
  aleo,
  aref_ruqaa,
  barlow,
  jetbrains_mono,
  poppins,
};

export default fonts;