import { InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import Head from 'next/head';
import cn from 'classnames';
import { PrismaClient } from '@prisma/client';
import ArchiveCardLoading from 'components/loading/ArchiveCardLoading';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const ArchiveCard = dynamic(() => import('components/ArchiveCard'), {
  loading: () => <ArchiveCardLoading />,
});

const Archive = ({
  archiveData,
  archiveKeys,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>RUA - Home</title>
      </Head>

      {archiveKeys.map((year) => (
        <div key={year} className={cn('mb-10')}>
          <h2 className="mb-4 text-3xl font-semibold text-gray-400">{year}</h2>

          <div className={cn('rounded-lg bg-white', 'dark:bg-rua-gray-800')}>
            {archiveData[year].map((post) => (
              <ArchiveCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

Archive.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export type Post = {
  id: string;
  date: string;
  title: string;
  url: string;
};

export const getStaticProps = async () => {
  const prisma = new PrismaClient();

  const posts = await prisma.posts.findMany({
    orderBy: {
      date: 'desc',
    },
    select: {
      id: true,
      title: true,
      date: true,
      url: true,
    },
  });

  const archiveData: {
    [key: string]: typeof posts;
  } = {};
  posts.map((post) => {
    const fullYear = post.date.getFullYear();

    archiveData?.[fullYear]
      ? archiveData[fullYear].push(post)
      : (archiveData[fullYear] = [post]);
  });

  return {
    props: {
      archiveData: JSON.parse(JSON.stringify(archiveData)) as {
        [key: string]: Post[];
      },
      archiveKeys: Object.keys(archiveData).reverse(),
    },
    revalidate: 60,
  };
};

export default Archive;
