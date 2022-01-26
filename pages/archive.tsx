import { InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { getArchiveData } from 'lib/posts';
import Head from 'next/head';
import cn from 'classnames';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const ArchiveCard = dynamic(() => import('components/ArchiveCard'));

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
          <h2 className="text-3xl text-gray-400 font-semibold mb-4">{year}</h2>

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

export const getStaticProps = () => {
  return {
    props: {
      ...getArchiveData(),
    },
  };
};

export default Archive;
