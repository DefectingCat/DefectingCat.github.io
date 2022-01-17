import { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { getAllPostNum, getPagingData, PagingData } from 'lib/posts';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const PostCard = dynamic(() => import('components/PostCard'));
const Pagination = dynamic(() => import('components/Pagination'));

const Page = ({
  num,
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

      <Pagination allPages={allPages} num={num} />
    </>
  );
};

export function getStaticPaths() {
  return {
    paths: getAllPostNum(),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<{ num?: string } & PagingData> = ({
  params,
}) => {
  const num = params?.num?.toString();

  return {
    props: {
      num,
      ...getPagingData(num),
    },
  };
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Page;
