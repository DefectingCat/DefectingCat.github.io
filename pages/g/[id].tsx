import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { NextPageWithLayout } from 'types';

const MainLayout = dynamic(() => import('layouts/MainLayout'));

const Gist: NextPageWithLayout = () => {
  return <></>;
};

export const getStaticProps:GetStaticProps  = async ({params}) => {
  return {
    props: {},
    revalidate: 60,
  };
};

Gist.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Gist;
