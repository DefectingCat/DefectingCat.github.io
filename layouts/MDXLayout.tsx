import { FC } from 'react';
import Head from 'next/head';
import HomeLayout from 'layouts/MainLayout';
import cn from 'classnames';

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
        <article
          className={cn(
            'rounded-lg p-4 md:p-6 bg-white',
            'dark:bg-rua-gray-800'
          )}
        >
          {children}
        </article>
      </HomeLayout>
    </>
  );
};

export default MDXLayout;
