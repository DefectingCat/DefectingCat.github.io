import MainLayout from 'layouts/MainLayout';
import { InferGetStaticPropsType } from 'next';
import { ReactElement } from 'react';
import { postLists } from 'lib/posts';

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
