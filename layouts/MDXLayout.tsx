import { FC } from 'react';
import Head from 'next/head';
import HomeLayout from 'layouts/MainLayout';

interface Props {
  title: string;
}

const MDXLayout: FC<Props> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <HomeLayout>
        <article className="rounded-lg p-4 md:p-6 bg-white">{children}</article>
      </HomeLayout>
    </>
  );
};

export default MDXLayout;
