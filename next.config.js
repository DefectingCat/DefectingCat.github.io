/** @type {import('next').NextConfig} */

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

module.exports = withMDX({
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  swcMinify: true,
  experimental: {
    // Native Node.js APIs are not supported in the Edge Runtime with `concurrentFeatures` enabled. Found `fs` imported.
    // concurrentFeatures: true,
    // serverComponents: true,
  },
});
