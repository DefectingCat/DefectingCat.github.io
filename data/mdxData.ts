import { hello } from 'data/sandpack/hello-world';
import {
  main,
  main2,
  styles,
} from 'data/sandpack/how-to-load-a-background-with-threejs';
import {
  genericApp,
  genericChild,
  hookApp,
} from './sandpack/generic-component-encapsulate-reusable-component';
import { Button, Input } from './sandpack';
import {
  store,
  useDeferredValue,
  useId,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition,
} from './sandpack/react18-new-hooks';

const data = {
  sandpack: {
    'hello-world': hello,
    'load-background-main': main,
    'load-background-main2': main2,
    'load-background-styles': styles,
    'generic-app': genericApp,
    'generic-child': genericChild,
    'generic-hookApp': hookApp,
    common: {
      Button,
      Input,
    },
    'react18-new-hooks': {
      useTransition,
      useDeferredValue,
      useId,
      store,
      useSyncExternalStore,
      useInsertionEffect,
    },
  },
};

export default data;
