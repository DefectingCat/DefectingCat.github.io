import PostCardLoading from 'components/RUA/loading/PostCardLoading';
import MainLayout from 'layouts/MainLayout';
import { postLists, PostPerPage } from 'lib/posts';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
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

const Blog = ({
  posts,
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
            hasPrev={false}
            hasNext={next <= total}
            prevLink={''}
            nextLink={`/blog/${next}`}
            current={1}
            total={total}
          />
        </Suspense>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<{
  posts: Post[];
  next: number;
  total: number;
}> = async () => {
  const posts = await postLists();
  return {
    props: {
      // Latest posts.
      posts: posts.slice(0, PostPerPage),
      next: 2,
      total: Math.ceil(posts.length / PostPerPage),
    },
  };
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Blog;