import { InferGetStaticPropsType } from 'next';
import { ReactElement } from 'react';
import { postLists } from 'lib/posts';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import PostCardLoading from 'components/RUA/loading/PostCardLoading'

const PostCard = dynamic(() => import('components/PostCard'), {
  loading: () => <PostCardLoading />,
});
const MainLayout = dynamic(() => import('layouts/MainLayout'));

const Blog = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-4xl mx-auto">
        <h1
          className={cn(
            'text-5xl font-bold text-center font-Barlow',
            'mt-8 mb-20 text-gray-800 dark:text-gray-200'
          )}
        >
          Blog posts
        </h1>

        <div className="px-4 lg:px-0">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      posts: await postLists(),
    },
  };
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Blog;
