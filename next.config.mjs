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
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    // runtime: 'nodejs',
    // outputStandalone: true,
    images: { allowFutureImage: true },
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

export default nextConfig;
