import clsx from 'clsx';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'RUA - Friends',
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <main className="flex-1 w-full max-w-4xl mx-auto">
        <h1
          className={clsx(
            'text-5xl font-bold text-center font-Barlow',
            'mt-8 mb-20 text-gray-800 dark:text-gray-200',
          )}
        >
          Friends
        </h1>
        <div className="px-4 lg:px-0">{children}</div>
      </main>
    </>
  );
};

export default Layout;
