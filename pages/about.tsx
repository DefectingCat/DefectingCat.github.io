import MainLayout from 'layouts/MainLayout';
import { NextPageWithLayout } from 'types';

const About: NextPageWithLayout = () => {
  return (
    <>
      <main className="h-[calc(100vh-142px)] flex justify-center items-center text-xl">
        <div className="w-full max-w-3xl px-10 text-2xl lg:px-0"></div>
      </main>
    </>
  );
};

About.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default About;
