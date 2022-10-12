import { hello } from 'data/sandpack/hello-world';
import {
  firstScene,
  loadBackground,
  resetStyles,
} from 'data/sandpack/how-to-load-a-background-with-threejs';
import { Button, Input } from './sandpack';
import {
  genericApp,
  genericChild,
  hookApp,
} from './sandpack/generic-component-encapsulate-reusable-component';
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
    common: {
      Button,
      Input,
    },
    'hello-world': {
      hello,
    },
    'how-to-load-a-background-with-threejs': {
      firstScene,
      loadBackground,
      resetStyles,
    },
    'generic-component-encapsulate-reusable-component': {
      genericApp,
      genericChild,
      hookApp,
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
