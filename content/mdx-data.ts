import { hello } from 'content/sandpack/hello-world';
import {
  firstScene,
  loadBackground,
  resetStyles,
} from 'content/sandpack/how-to-load-a-background-with-threejs';
import { Button, Input } from './sandpack';
import {
  app1,
  app2,
  app3,
  signal1,
  signal2,
  signal3,
} from './sandpack/automatic-dependency-collect';
import {
  MultiStore,
  Reducer,
  miniRedux,
  multi,
} from './sandpack/build-own-store-with-usesyncexternalstore';
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
    'build-own-store-with-usesyncexternalstore': {
      multi,
      miniRedux,
      MultiStore,
      Reducer,
    },
    'automatic-dependency-collect': {
      signal1,
      app1,
      signal2,
      app2,
      signal3,
      app3,
    },
  },
};

export default data;
