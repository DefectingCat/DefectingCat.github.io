import MainLayout from 'layouts/MainLayout';
import Head from 'next/head';
import type { NextPageWithLayout } from 'types';

const Home: NextPageWithLayout = () => {
  return (
    <div className="text-lg text-red-700">
      <Head>
        <title>RUA - HOME</title>
      </Head>

      <div>hi</div>
    </div>
  );
};

Home.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
