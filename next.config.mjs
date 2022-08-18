import remarkFrontmatter from 'remark-frontmatter';
import composePlugins from 'next-compose-plugins';
// import { remarkCodeHike } from '@code-hike/mdx';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const theme = require('shiki/themes/nord.json');

const composedConfig = composePlugins([
  /** @type {import('next').NextConfig} */
  {
    reactStrictMode: true,
    output: 'standalone',
    experimental: {
      // runtime: 'nodejs',
      // outputStandalone: true,
      images: { allowFutureImage: true },
    },
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: { domains: ['avatars.githubusercontent.com'] },
  },
]);

export default composedConfig;
