import type { ReactElement } from 'react';
import type { InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { getPagingData, getSortedPostsData } from 'lib/posts';
import HomeLayout from 'layouts/HomeLayout';

const Paging = dynamic(() => import('components/Paging'));
const PostCard = dynamic(() => import('components/PostCard'));

export const getStaticProps = async () => {
  const allPostsData = await getSortedPostsData();

  return {
    props: {
      ...getPagingData(allPostsData),
    },
  };
};

const Home = ({
  allPages,
  postDatas,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>RUA - Home</title>
      </Head>

      {postDatas.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      <Paging allPages={allPages} num="1" />
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
