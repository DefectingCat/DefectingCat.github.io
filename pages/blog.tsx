import MainLayout from 'layouts/MainLayout';
import { Post } from 'types';
import { InferGetStaticPropsType } from 'next';
import { ReactElement } from 'react';
import { server } from 'lib/utils/constant';

const Blog = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-semibold text-center font-Barlow">
          Blog posts
        </h1>

        <div>
          {posts.map((post) => (
            <article key={post.slug}>{post.title}</article>
          ))}
        </div>
      </main>
    </>
  );
};

export const getStaticProps = async () => {
  const response = await fetch(`${server}/api/posts`);
  const posts = (await response.json()) as Post[];

  return {
    props: {
      posts,
    },
  };
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Blog;
