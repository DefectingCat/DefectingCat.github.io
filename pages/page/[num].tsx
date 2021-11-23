import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import {
  AllPostsData,
  getAllPostNum,
  getPagingData,
  getSortedPostsData,
} from '../../lib/posts';
import Paging from '../../components/Paging';
import PostCard from '../../components/PostCard';
import HomeLayout from '../../layouts/HomeLayout';
import { ReactElement } from 'react';

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
