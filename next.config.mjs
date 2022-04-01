import remarkFrontmatter from 'remark-frontmatter';
import mdx from '@next/mdx';
import rehypePrism from '@mapbox/rehype-prism';
// import remarkToc from 'remark-toc';
import composePlugins from 'next-compose-plugins';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

const composedConfig = composePlugins([
  mdx({
    extension: /\.mdx?$/,
    options: {
      remarkPlugins: [
        remarkFrontmatter,
        // [remarkToc, { maxDepth: 2 }],
        remarkGfm,
      ],
      rehypePlugins: [rehypePrism, rehypeSlug],
      providerImportSource: '@mdx-js/react',
    },
  }),
  /** @type {import('next').NextConfig} */
  {
    reactStrictMode: true,
    // experimental: {
    //    reactMode: 'concurrent',
    // },
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  },
]);

export default composedConfig;
