import React, { memo } from 'react';
import clsx from 'clsx';

const PostCardLoading = () => {
  return (
    <article
      className={clsx(
        'rounded-xl py-4 px-5 md:p-7 ',
        'hover:bg-sky-100 hover:bg-opacity-50',
        'dark:hover:bg-rua-gray-800 dark:hover:bg-opacity-100',
        'flex justify-between text-gray-800 ',
        'mb-4 dark:text-gray-200',
        'flex-col',
      )}
    >
      <div className="flex justify-between">
        <h2
          className={clsx(
            'w-96 bg-gray-300 h-7 animate-pulse',
            'mb-4 text-3xl font-semibold font-Barlow',
            'rounded-lg dark:bg-gray-500',
          )}
        ></h2>

        <div
          className={clsx(
            'hidden animate-pulse h-5 bg-gray-300',
            'dark:bg-gray-500 lg:block w-24',
            'rounded-lg',
          )}
        ></div>
      </div>

      <div className="flex justify-between">
        <div className="flex items-center text-sm">
          <div
            className={clsx(
              'mr-4 last:mr-0 w-9 animate-pulse h-5',
              'rounded-lg bg-gray-300 dark:bg-gray-500',
            )}
          ></div>
          <div
            className={clsx(
              'mr-4 last:mr-0 w-9 animate-pulse h-5',
              'rounded-lg bg-gray-300 dark:bg-gray-500',
            )}
          ></div>
        </div>

        <div
          className={clsx(
            'hidden animate-pulse h-5 bg-gray-300',
            'dark:bg-gray-500 lg:block w-24',
            'rounded-lg lg:hidden',
          )}
        ></div>
      </div>
    </article>
  );
};

export default memo(PostCardLoading);
