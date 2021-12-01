import '../styles/globals.css';
import { ReactElement, ReactNode, useEffect } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import '../assets/css/rua.css';
import Head from 'next/head';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Chakra } from '../Chakra';
import { useRouter } from 'next/router';

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

  const router = useRouter();

  const handleRouteChange = (
    url: string,
    { shallow }: { shallow: 'with' | 'without' }
  ) => {
    console.log(
      `App is changing to ${url} ${
        shallow ? 'with' : 'without'
      } shallow routing`
    );
  };
  const handleStart = () => {
    NProgress.start();
  };
  const handleStop = () => {
    NProgress.done();
  };
  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeStart', handleStop);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeStart', handleStop);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/img/favicon.webp"></link>
        <meta name="keywords" content="Blog RUA" />
        <meta name="description" content="Personal blog." />
        <meta name="author" content="Arthur,i@rua.plus" />
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
