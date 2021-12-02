import { ReactElement } from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import {
  AllPostsData,
  getAllPostNum,
  getPagingData,
  getSortedPostsData,
} from 'lib/posts';
import HomeLayout from 'layouts/HomeLayout';

const Paging = dynamic(() => import('components/Paging'));
const PostCard = dynamic(() => import('components/PostCard'));

export async function getStaticPaths() {
  const paths = await getAllPostNum();
  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const allPostsData = await getSortedPostsData();

  return {
    props: {
      num: params?.num?.toString(),
      ...getPagingData(allPostsData, params?.num?.toString()),
    },
  };
};

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

      {postDatas.map((post: AllPostsData) => (
        <PostCard key={post.id} post={post} />
      ))}

      <Paging allPages={allPages} num={num} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Page;
