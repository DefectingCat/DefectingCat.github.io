import '@catppuccin/highlightjs/sass/catppuccin-variables.rgb.scss';
import clsx from 'clsx';
import components from 'components/mdx/components';
import data from 'content/mdx-data';
import { allPostsPath, readSinglePost } from 'lib/posts';
import { SingleToc, generateToc } from 'lib/utils';
import { compileMDX } from 'next-mdx-remote/rsc';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { Post } from 'types';
import 'styles/rua.css';

const PostToc = dynamic(() => import('components/post/post-toc'));
const PostCommnetLine = dynamic(
  () => import('components/post/post-commnet-line'),
);
const PostComment = dynamic(() => import('components/post/post-comment'));

export async function generateStaticParams() {
  return await allPostsPath();
}

const Page = async ({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) => {
  const { slug } = await params;
  if (!slug) notFound();

  const post = await readSinglePost(slug);
  const toc = generateToc(post);

  const calcLength = (prev: number, cur: SingleToc) => {
    const childLen = cur.children.length;
    return childLen ? prev + childLen + 1 : prev + 1;
  };
  const tocLength = toc.reduce(calcLength, 0);
  const mdxSource = await compileMDX<Post>({
    source: post,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypeHighlight, { alias: { vue: 'xml' } }],
          rehypeSlug,
        ],
      },
      scope: data,
    },
    components: { ...(components as {}) },
  });

  return (
    <>
      <main
        id="article"
        className={clsx(
          'relative max-w-4xl px-4 mx-auto my-10',
          'lg:w-4xl w-full flex-1',
        )}
      >
        <h1>{mdxSource.frontmatter?.title}</h1>
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
