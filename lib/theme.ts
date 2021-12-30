// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react';

// 3. extend the theme
const theme = extendTheme({
  initialColorMode: 'system',
  useSystemColorMode: false,
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
  styles: {
    global: (props: any) => ({
      'html, body': {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'home.bg',
      },
      'img, #write iframe': {
        filter:
          props.colorMode === 'dark'
            ? 'saturate(105%) contrast(110%) brightness(75%)'
            : 'unset',
        transitionProperty: 'filter',
        transitionDuration: 'var(--chakra-transition-duration-normal)',
      },
      div: {
        transitionProperty: 'background-color',
        transitionDuration: 'var(--chakra-transition-duration-normal)',
      },
    }),
  },
});

export default theme;
