import cn from 'classnames';
import MainLayout from 'layouts/MainLayout';
import { ReactElement } from 'react';
import Head from 'next/head';

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
