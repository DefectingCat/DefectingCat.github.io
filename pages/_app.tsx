import '../styles/globals.css';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import '../assets/css/rua.css';
import Head from 'next/head';

import { Chakra } from '../Chakra';

type NextPageWithLayout = NextPage & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/img/favicon.webp"></link>
      </Head>

      <Provider store={store}>
        <Chakra cookies={pageProps.cookies}>
          {getLayout(<Component {...pageProps} />)}
        </Chakra>
      </Provider>
    </>
  );
}
export default MyApp;

export { getServerSideProps } from '../Chakra';
