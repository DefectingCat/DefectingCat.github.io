import useRouterLoading from 'lib/hooks/useRouterLoading';
import { ThemeProvider } from 'next-themes';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect } from 'react';
import 'styles/globals.css';
import 'styles/prism-one-dark.css';
import 'styles/prism-one-light.css';
import 'styles/rua.css';
import { AppPropsWithLayout } from 'types';

const VercelLoading = dynamic(
  () => import('components/RUA/loading/VercelLoading')
);

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const { loading } = useRouterLoading();

  useEffect(() => {
    document.body.style.transition = 'all 0.3s ease-out';
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
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>

      {loading && <VercelLoading />}
    </>
  );
}

export default MyApp;
