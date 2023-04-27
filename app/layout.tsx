import '@docsearch/css/dist/style.css';
import clsx from 'clsx';
import BackToTop from 'components/common/back-to-top';
import fonts from 'lib/fonts';
import { Metadata } from 'next';
import 'styles/globals.css';
import 'styles/prism-one-dark.css';
import 'styles/prism-one-light.css';
import 'styles/rua.css';
import Footer from './footer';
import HeadBar from './nav-bar';
import RUAThemeProvider from './theme-provider';

export const metadata: Metadata = {
  title: 'RUA',
  description: 'Personal blog.',
  authors: {
    name: 'xfy',
    url: 'i@rua.plus',
  },
  icons: '/images/favicon.ico',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx(Object.values(fonts).map((font) => font.variable))}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="preconnect"
          href="https://ZUYZBUJBQW-dsn.algolia.net"
          crossOrigin=""
        />
      </head>
      <body>
        <RUAThemeProvider>
          <HeadBar />
          {children}
          <Footer />
          <BackToTop />
        </RUAThemeProvider>
      </body>
    </html>
  );
}