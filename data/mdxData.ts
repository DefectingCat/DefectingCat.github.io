import { hello } from 'data/sandpack/hello-world';
import {
  main,
  main2,
  styles,
} from 'data/sandpack/how-to-load-a-background-with-threejs';

import skybox_example from 'public/images/p/how-to-load-a-background-with-threejs/Skybox_example.png';

const data = {
  sandpack: {
    'hello-world': hello,
    'load-background-main': main,
    'load-background-main2': main2,
    'load-background-styles': styles,
  },
  images: {
    'load-background': {
      skybox_example,
    },
  },
};

export default data;
