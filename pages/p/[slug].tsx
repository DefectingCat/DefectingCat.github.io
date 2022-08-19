import { allPostsPath, readSinglePost } from 'lib/posts';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import components from 'components/mdx/components';
import data from 'data/mdxData';
import rehypePrism from '@mapbox/rehype-prism';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import dynamic from 'next/dynamic';
import { generateToc, SingleToc } from 'lib/utils';
import PostToc from 'components/post/PostToc';

const Footer = dynamic(() => import('components/Footer'));
const HeadBar = dynamic(() => import('components/NavBar'));
const PostComment = dynamic(() => import('components/post/PostComment'));

const Slug = ({
  mdxSource,
  toc,
  tocLength,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <HeadBar />

      <main id="article" className="relative max-w-4xl px-4 mx-auto my-10">
        <h1>{mdxSource.frontmatter?.title}</h1>
        <time>{mdxSource.frontmatter?.date}</time>
        <PostToc toc={toc} tocLength={tocLength} />

        <article id="post-content">
          <MDXRemote {...mdxSource} components={components as {}} />
          <PostComment />
        </article>
      </main>

      <Footer />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: await allPostsPath(),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  mdxSource: MDXRemoteSerializeResult;
  toc: SingleToc[];
  tocLength: number;
}> = async ({ params }) => {
  const slug = params?.slug?.toString();
  if (!slug)
    return {
      notFound: true,
    };

  const post = await readSinglePost(slug);
  const toc = generateToc(post);
  let tocLength = toc.length;
  toc.forEach(
    (item) => item.children.length && (tocLength += item.children.length)
  );

  const mdxSource = await serialize(post, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [rehypePrism, { alias: { vue: 'xml' }, ignoreMissing: true }],
        rehypeSlug,
      ],
    },
    parseFrontmatter: true,
    scope: data,
  });

  return {
    props: {
      mdxSource,
      toc,
      tocLength,
    },
  };
};

export default Slug;
