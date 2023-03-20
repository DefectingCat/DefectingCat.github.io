import 'styles/globals.css';
import RUAThemeProvider from './theme-provider';

export const metadata = {
  title: 'RUA',
};

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
        <RUAThemeProvider>{children}</RUAThemeProvider>
      </body>
    </html>
  );
}
