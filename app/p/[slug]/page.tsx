import rehypePrism from '@mapbox/rehype-prism';
import Image from 'components/mdx/image';
import components from 'components/mdx/components';
import PostCommnetLine from 'components/post/post-commnet-line';
import PostToc from 'components/post/post-toc';
import data from 'content/mdx-data';
import { readSinglePost } from 'lib/posts';
import { SingleToc, generateToc } from 'lib/utils';
import { MDXRemote, compileMDX } from 'next-mdx-remote/rsc';
import { serialize } from 'next-mdx-remote/serialize';
import { notFound } from 'next/navigation';
import { Suspense, lazy } from 'react';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const PostComment = lazy(() => import('components/post/post-comment'));

const Page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const slug = params.slug;
  if (!slug) notFound();

  const post = await readSinglePost(slug);
  const toc = generateToc(post);
  // const { ref, inView } = useInView();

  const calcLength = (prev: number, cur: SingleToc) => {
    const childLen = cur.children.length;
    return childLen ? prev + childLen + 1 : prev + 1;
  };
  const tocLength = toc.reduce(calcLength, 0);
  const mdxSource = await compileMDX({
    source: post,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypePrism, { alias: { vue: 'xml' }, ignoreMissing: true }],
          rehypeSlug,
        ],
      },
      scope: data,
    },
    components: { ...(components as {}) },
  });

  return (
    <>
      <main id="article" className="relative max-w-4xl px-4 mx-auto my-10">
        {/* @ts-expect-error Async Server Component */}
        <h1>{mdxSource.frontmatter?.title}</h1>
        {/* @ts-expect-error Async Server Component */}
        <time>{mdxSource.frontmatter?.date}</time>
        <PostToc toc={toc} tocLength={tocLength} />

        <article id="post-content">
          {mdxSource.content}

          <PostCommnetLine />
          <div className="mt-4">
            <PostComment />
          </div>
        </article>
      </main>
    </>
  );
};

export default Page;