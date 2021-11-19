import '../styles/globals.css';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import 'antd/dist/antd.css';
import '../assets/css/rua.css';

const theme = extendTheme({
  colors: {
    home: {
      bg: '#f5f5fa',
    },
  },
  shadows: {
    card: '0px 4px 8px rgba(0, 0, 0, 0.04),0px 0px 2px rgba(0, 0, 0, 0.06),0px 0px 1px rgba(0, 0, 0, 0.04)',
  },
  fonts: {
    body: "-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Segoe UI,Arial,Roboto,'PingFang SC',miui,'Hiragino Sans GB','Microsoft Yahei',sans-serif",
  },
});

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
    </Provider>
  );
}
export default MyApp;
