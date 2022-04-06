import 'styles/globals.css';
import Head from 'next/head';
import { AppPropsWithLayout } from 'types';
import { ThemeProvider } from 'next-themes';
import 'styles/prism-one-light.css';
import 'styles/prism-one-dark.css';
import 'styles/rua.css';
import { MDXProvider } from '@mdx-js/react';
import Anchor from 'components/mdx/Anchor';
import Image from 'components/mdx/Image';

const components = {
  a: Anchor,
  img: Image,
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/img/favicon.ico" />
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
    </>
  );
}

export default MyApp;
