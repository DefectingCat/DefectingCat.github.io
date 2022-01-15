import cn from 'classnames';
import { ReactElement } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getPagingData } from 'lib/posts';
import { InferGetStaticPropsType } from 'next';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const PostCard = dynamic(() => import('components/PostCard'));

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
        <PostCard key={post.id} {...post} />
      ))}
    </>
  );
};

export const getStaticProps = () => {
  return {
    props: {
      ...getPagingData(),
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
