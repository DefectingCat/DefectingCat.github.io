import rehypePrism from '@mapbox/rehype-prism';
import components from 'components/mdx/components';
import PostCommnetLine from 'components/post/PostCommnetLine';
import PostToc from 'components/post/PostToc';
import data from 'data/mdxData';
import MainLayout from 'layouts/MainLayout';
import useInView from 'lib/hooks/useInView';
import { allPostsPath, readSinglePost } from 'lib/posts';
import { generateToc, SingleToc } from 'lib/utils';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import dynamic from 'next/dynamic';
import { ReactElement, Suspense } from 'react';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const PostComment = dynamic(() => import('components/post/PostComment'), {
  suspense: true,
});

const Slug = ({
  mdxSource,
  toc,
  tocLength,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { ref, inView } = useInView();

  return (
    <>
      <main id="article" className="relative max-w-4xl px-4 mx-auto my-10">
        <h1>{mdxSource.frontmatter?.title}</h1>
        <time>{mdxSource.frontmatter?.date}</time>
        <PostToc toc={toc} tocLength={tocLength} />

        <article id="post-content">
          <MDXRemote {...mdxSource} components={components as {}} />

          <PostCommnetLine />
          <div ref={ref} className="mt-4">
            <Suspense fallback>{inView && <PostComment />}</Suspense>
          </div>
        </article>
      </main>
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
  if (!slug) {
    return {
      notFound: true,
    };
  }

  const post = await readSinglePost(slug);
  const toc = generateToc(post);

  const calcLength = (prev: number, cur: SingleToc) => {
    const childLen = cur.children.length;
    return childLen ? prev + childLen + 1 : prev + 1;
  };
  const tocLength = toc.reduce(calcLength, 0);

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

Slug.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Slug;
