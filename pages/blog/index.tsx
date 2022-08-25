import PostCardLoading from 'components/RUA/loading/PostCardLoading';
import { postLists, PostPerPage } from 'lib/posts';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { Post } from 'types';

const PostCard = dynamic(() => import('components/PostCard'), {
  loading: () => <PostCardLoading />,
});
const MainLayout = dynamic(() => import('layouts/MainLayout'));
const BlogList = dynamic(() => import('layouts/BlogList'));
const Pagination = dynamic(() => import('components/RUA/RUAPagination'));

const Blog = ({
  posts,
  next,
  total,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-4xl mx-auto">
        <BlogList>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </BlogList>

        <Pagination
          className="py-6 mt-4 px-7 lg:px-5"
          hasPrev={false}
          hasNext={next === total}
          prevLink={''}
          nextLink={`/blog/${next}`}
          current={1}
          total={total}
        />
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
