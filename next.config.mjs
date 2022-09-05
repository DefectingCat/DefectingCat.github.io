// import composePlugins from 'next-compose-plugins';

// const composedConfig = composePlugins([
//   /** @type {import('next').NextConfig} */
//   {
//     reactStrictMode: true,
//     output: 'standalone',
//     experimental: {
//       // runtime: 'nodejs',
//       // outputStandalone: true,
//       images: { allowFutureImage: true },
//     },
//     pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
//     images: { domains: ['avatars.githubusercontent.com'] },
//   },
// ]);

/**
 * @type {import('next').NextConfig}
 */
const isExport = process.env.NEXT_BUILD === 'export';
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    // runtime: 'nodejs',
    // outputStandalone: true,
    images: isExport
      ? { allowFutureImage: true, unoptimized: true }
      : { allowFutureImage: true },
  },
  // assetPrefix: isExport ? './' : undefined,
  // images:
  //   process.env.NEXT_BUILD === 'export'
  //     ? {
  //         loader: 'imgix',
  //         path: 'https://rua.plus/',
  //       }
  //     : {},
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

export default nextConfig;
