import { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { PrismaClient } from '@prisma/client';
import { Post } from 'pages/index';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const PostCard = dynamic(() => import('components/PostCard'));
const Pagination = dynamic(() => import('components/Pagination'));

const Page = ({
  num,
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

      <Pagination allPages={allPages} num={num} />
    </>
  );
};

export async function getStaticPaths() {
  const prisma = new PrismaClient();

  const pagingSize = 10;
  const totalNum = await prisma.posts.count();
  const allPages = Math.ceil(totalNum / pagingSize);

  const numPages = [];
  for (let i = 2; i <= allPages; i++) {
    numPages.push({
      params: {
        num: i.toString(),
      },
    });
  }

  return {
    paths: numPages,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<{
  num?: string;
  allPages: number;
  posts: Post[];
}> = async ({ params }) => {
  const num = params?.num?.toString();
  const prisma = new PrismaClient();

  const pagingSize = 10;
  const totalNum = await prisma.posts.count();
  const posts = await prisma.posts.findMany({
    orderBy: {
      date: 'desc',
    },
    skip: Number(num) * 10 - pagingSize,
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
  const allPages = Math.ceil(totalNum / pagingSize);

  return {
    props: {
      num,
      allPages,
      posts: JSON.parse(JSON.stringify(posts)) as Post[],
    },
  };
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Page;
