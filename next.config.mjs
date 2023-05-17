/**
 * @type {import('next').NextConfig}
 */
const isExport = process.env.NEXT_BUILD === 'export';

const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  // output: 'standalone',
  images: isExport ? { unoptimized: true } : {},
  experimental: {
    // runtime: 'experimental-edge',
    // largePageDataBytes: 512 * 1000,
    appDir: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // assetPrefix: isExport ? './' : undefined,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

export default nextConfig;