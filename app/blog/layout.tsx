import clsx from 'clsx';
import { ReactNode } from 'react';

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="max-w-4xl mx-auto">
      <h1
        className={clsx(
          'text-5xl font-bold text-center font-Barlow',
          'mt-8 mb-20 text-gray-800 dark:text-gray-200'
        )}
      >
        Blog posts
      </h1>

      <div className="px-4 lg:px-0">{children}</div>
    </main>
  );
}
