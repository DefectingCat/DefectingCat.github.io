import clsx from 'clsx';
import PostCardLoading from 'components/pages/blog/post-card-loading';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'RUA - Blog',
};

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="w-full max-w-4xl mx-auto">
      <h1
        className={clsx(
          'text-5xl font-bold text-center font-Barlow',
          'mt-8 mb-20 text-gray-800 dark:text-gray-200',
        )}
      >
        Blog posts
      </h1>

      <div className="px-4 lg:px-0">{children}</div>
    </main>
  );
}
