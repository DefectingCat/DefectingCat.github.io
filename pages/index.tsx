import cn from 'classnames';
import { ReactElement } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const MainLayout = dynamic(() => import('layouts/MainLayout'));

const Home = () => {
  return (
    <>
      <Head>
        <title>RUA - Home</title>
      </Head>

      <div className={cn('')}>Hello</div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
