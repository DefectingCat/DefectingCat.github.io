import PostCardLoading from 'components/RUA/loading/PostCardLoading';
import MainLayout from 'layouts/MainLayout';
import { getPostListPath, postLists, PostPerPage } from 'lib/posts';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { Fragment, ReactElement, Suspense } from 'react';
import { Post } from 'types';

const PostCard = dynamic(() => import('components/PostCard'), {
  suspense: true,
});
const BlogList = dynamic(() => import('layouts/BlogList'), { suspense: true });
const Pagination = dynamic(() => import('components/RUA/RUAPagination'), {
  suspense: true,
});

const BlogPage = ({
  posts,
  prev,
  next,
  total,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-4xl mx-auto">
        <Suspense fallback>
          <BlogList>
            {posts.map((post) => (
              <Fragment key={post.slug}>
                <Suspense fallback={<PostCardLoading />}>
                  <PostCard post={post} />
                </Suspense>
              </Fragment>
            ))}
          </BlogList>
        </Suspense>

        <Suspense fallback>
          <Pagination
            className="py-6 mt-4 px-7 lg:px-5"
            hasPrev={!!prev}
            hasNext={next <= total}
            prevLink={prev === 1 ? '/blog' : `/blog/${prev}`}
            nextLink={`/blog/${next}`}
            current={next - 1}
            total={total}
          />
        </Suspense>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: await getPostListPath(),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  posts: Post[];
  prev: number;
  next: number;
  total: number;
}> = async ({ params }) => {
  const page = Number(params?.page);
  if (!page) {
    return {
      notFound: true,
    };
  }
  const posts = await postLists();

  return {
    props: {
      posts: posts.slice((page - 1) * PostPerPage, PostPerPage * page),
      prev: page - 1,
      next: page + 1,
      total: Math.ceil(posts.length / PostPerPage),
    },
  };
};

BlogPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default BlogPage;