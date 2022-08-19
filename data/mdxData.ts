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

const data = {
  sandpack: {
    'hello-world': hello,
    'load-background-main': main,
    'load-background-main2': main2,
    'load-background-styles': styles,
    'generic-app': genericApp,
    'generic-child': genericChild,
    'generic-hookApp': hookApp,
  },
};

export default data;
