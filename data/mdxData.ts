import { hello } from 'data/sandpack/hello-world';
import {
  main,
  main2,
  styles,
} from 'data/sandpack/how-to-load-a-background-with-threejs';

import skybox_example from 'public/images/p/how-to-load-a-background-with-threejs/Skybox_example.png';
import crawler from 'public/images/p/setting-up-docsearch-for-nextjs/cannot-login-to-algolia-crawler.png';
import indexFormat from 'public/images/p/setting-up-docsearch-for-nextjs/index-format.png';
import windowsEnv from 'public/images/p/my-develop-environmental/windows-environmentail.png';
import miniRouter1 from 'public/images/p/create-a-mini-router-for-react/router.webp';
import miniRouter4 from 'public/images/p/create-a-mini-router-for-react/image-20210823154009498.webp';

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
    'setting-up-docsearch': {
      crawler,
      indexFormat,
    },
    'dev-env': {
      windowsEnv,
    },
    miniRouter: {
      miniRouter1,
      miniRouter4,
    },
  },
};

export default data;
