import '@docsearch/css/dist/style.css';
import clsx from 'clsx';
import BackToTop from 'components/common/back-to-top';
import Footer from 'components/pages/footer';
import HeadBar from 'components/pages/nav-bar';
import RUAThemeProvider from 'components/pages/theme-provider';
import fonts from 'lib/fonts';
import { Metadata } from 'next';
import 'styles/globals.css';
import 'styles/rua.css';

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
      <body className="latte">
        <RUAThemeProvider>
          <div className="flex flex-col min-h-[100vh]">
            <HeadBar />
            {children}
            <Footer />
            <BackToTop />
          </div>
        </RUAThemeProvider>
      </body>
    </html>
  );
}
