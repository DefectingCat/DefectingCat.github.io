import 'styles/globals.css';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import Head from 'next/head';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/img/favicon.webp" />
        <meta name="keywords" content="Blog RUA" />
        <meta name="description" content="Personal blog." />
        <meta name="author" content="Arthur,i@rua.plus" />
        <title>RUA</title>
      </Head>

      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

export default MyApp;
