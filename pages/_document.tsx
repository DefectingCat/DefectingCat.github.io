import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Aleo&family=Aref+Ruqaa&family=Barlow:ital@0;1&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Poppins:ital@0;1&display=swap"
          rel="stylesheet"
        ></link>
        <link
          rel="preconnect"
          href="https://ZUYZBUJBQW-dsn.algolia.net"
          crossOrigin=""
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
