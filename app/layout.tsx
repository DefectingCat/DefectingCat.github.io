import 'styles/globals.css';
import '@docsearch/css/dist/style.css';
import RUAThemeProvider from './theme-provider';
import HeadBar from 'components/nav-bar';
import Footer from 'components/footer';
import BackToTop from 'components/common/back-to-top';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
        <HeadBar />
        <RUAThemeProvider>{children}</RUAThemeProvider>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
