import {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Chakra } from 'Chakra';
import { Progress } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from 'app/store';
import 'styles/globals.css';
import 'styles/rua.css';
import { Text } from '@chakra-ui/react';
import { MDXProvider } from '@mdx-js/react';
import RuaH2 from 'components/mdx/RuaH2';

type NextPageWithLayout = NextPage & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// MDX components
const mdxCompoents = {
  h2: RuaH2,
  p: Text,
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = useCallback(
    (url: string, { shallow }: { shallow: 'with' | 'without' }) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? 'with' : 'without'
        } shallow routing`
      );

      setLoading(true);
    },
    []
  );
  const handleComplete = useCallback(() => {
    setLoading(false);
  }, []);
  useEffect(() => {
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [handleComplete, handleStart, router.events]);

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
          {loading && (
            <Progress
              position="fixed"
              top="0"
              left="0"
              right="0"
              size="xs"
              isIndeterminate
              zIndex="1984"
            />
          )}
          <MDXProvider components={mdxCompoents}>
            {getLayout(<Component {...pageProps} />)}
          </MDXProvider>
        </Chakra>
      </Provider>
    </>
  );
}
export default MyApp;

export { getServerSideProps } from '../Chakra';
