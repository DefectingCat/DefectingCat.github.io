import 'styles/globals.css';
import Head from 'next/head';
import { AppPropsWithLayout } from 'types';
import { ThemeProvider } from 'next-themes';
import 'styles/prism-one-light.css';
import 'styles/prism-one-dark.css';
import 'styles/rua.css';
import { MDXProvider } from '@mdx-js/react';
import Anchor from 'components/mdx/Anchor';
import { useRouter } from 'next/router';
import { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const VercelLoading = dynamic(
  () => import('components/RUA/loading/VercelLoading')
);

const components = {
  a: Anchor,
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = useCallback(
    (url: string) => {
      url !== router.pathname ? setLoading(true) : setLoading(false);
    },
    [router.pathname]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta name="keywords" content="Blog RUA" />
        <meta name="description" content="Personal blog." />
        <meta name="author" content="Arthur,i@rua.plus" />
        <title>RUA</title>
      </Head>

      <ThemeProvider
        attribute="class"
        storageKey="rua-theme"
        themes={['light', 'dark']}
        enableSystem
        defaultTheme="system"
      >
        <MDXProvider components={components}>
          {getLayout(<Component {...pageProps} />)}
        </MDXProvider>
      </ThemeProvider>

      {loading && <VercelLoading />}
    </>
  );
}

export default MyApp;
