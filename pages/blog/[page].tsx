import PostCardLoading from 'components/RUA/loading/PostCardLoading';
import { getPostListPath, postLists, PostPerPage } from 'lib/posts';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { Post } from 'types';

const PostCard = dynamic(() => import('components/PostCard'), {
  loading: () => <PostCardLoading />,
});
const MainLayout = dynamic(() => import('layouts/MainLayout'));
const BlogList = dynamic(() => import('layouts/BlogList'));
const Pagination = dynamic(() => import('components/RUA/RUAPagination'));

const BlogPage = ({
  posts,
  prev,
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
          hasPrev={!!prev}
          hasNext={next === total}
          prevLink={prev === 1 ? '/blog' : `/blog/${prev}`}
          nextLink={`/blog/${next}`}
          current={next - 1}
          total={total}
        />
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
      posts: posts.slice((page - 1) * PostPerPage, PostPerPage + 1),
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
