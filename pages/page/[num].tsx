import { ReactElement } from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getAllPostNum, getPagingData } from 'lib/posts';
import HomeLayout from 'layouts/HomeLayout';
import type { PagingData } from 'lib/posts';

const Paging = dynamic(() => import('components/Paging'));
const PostCard = dynamic(() => import('components/PostCard'));

export function getStaticPaths() {
  return {
    paths: getAllPostNum(),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<
  { num: string | undefined } & PagingData
> = ({ params }) => {
  const num = params?.num?.toString();

  return {
    props: {
      num,
      ...getPagingData(num),
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

      {postDatas.map((post) => (
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
