import MainLayout from 'layouts/MainLayout';
import Head from 'next/head';
import type { NextPageWithLayout } from 'types';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>RUA - HOME</title>
      </Head>

      <main className="h-[calc(100vh-142px)] flex justify-center items-center text-xl">
        <div>Hi there,👋 Im a next.js app.</div>
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
