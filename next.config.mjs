import remarkFrontmatter from 'remark-frontmatter';
import mdx from '@next/mdx';
import rehypePrism from '@mapbox/rehype-prism';

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter],
    rehypePlugins: [rehypePrism],
    // providerImportSource: '@mdx-js/react',
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // experimental: {
  //    reactMode: 'concurrent',
  // },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

export default withMDX(nextConfig);
