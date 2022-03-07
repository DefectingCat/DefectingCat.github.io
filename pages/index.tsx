import { ReactElement } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { InferGetStaticPropsType } from 'next';
import { PrismaClient } from '@prisma/client';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const PostCard = dynamic(() => import('components/PostCard'));
const Pagination = dynamic(() => import('components/Pagination'));

const Home = ({
  allPages,
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>RUA - Home</title>
      </Head>

      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}

      <Pagination allPages={allPages} num="1" />
    </>
  );
};

export type Post = {
  id: string;
  title: string;
  date: string;
  desc: string;
  index_img: string | null;
  url: string;
  tags: {
    name: string;
  }[];
};

export const getStaticProps = async () => {
  const prisma = new PrismaClient();

  const totalNum = await prisma.posts.count();
  const posts = await prisma.posts.findMany({
    orderBy: {
      date: 'desc',
    },
    take: 10,
    select: {
      id: true,
      title: true,
      date: true,
      desc: true,
      index_img: true,
      url: true,
      tags: {
        select: {
          name: true,
        },
      },
    },
  });
  const pagingSize = 10;
  const allPages = Math.ceil(totalNum / pagingSize);

  return {
    props: {
      allPages,
      posts: JSON.parse(JSON.stringify(posts)) as Post[],
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
