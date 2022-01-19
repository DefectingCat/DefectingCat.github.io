import React, { FC } from 'react';
import dynamic from 'next/dynamic';
import { FiCalendar } from 'react-icons/fi';
import cn from 'classnames';

const DateFormater = dynamic(() => import('components/DateFormater'));

interface Props {
  title: string;
  tags: string[] | string;
  date: string;
}

const PostHeader: FC<Props> = ({ title, tags, date }) => {
  return (
    <header className={'mb-6'}>
      <h1
        className={cn(
          'text-3xl md:text-4xl font-semibold mb-4',
          'text-gray-700 dark:text-gray-300'
        )}
      >
        {title}
      </h1>

      <div className={'mb-4'}>
        {Array.isArray(tags)
          ? // Multi tags
            tags.map((item) => (
              <div
                key={item}
                className={cn(
                  'rounded-md bg-gray-100 px-2 py-1 inline text-sm',
                  'text-gray-700 mr-3 '
                )}
              >
                {item}
              </div>
            ))
          : // Signal tags
            tags && (
              <div
                className={cn(
                  'rounded-md bg-gray-100 px-2 py-1 inline text-sm',
                  'text-gray-700 dark:text-gray-300 dark:bg-gray-500'
                )}
              >
                {tags}
              </div>
            )}
      </div>

      <div
        className={'flex items-center text-gray-600 dark:text-gray-400 text-sm'}
      >
        <FiCalendar className={'mr-2'} />
        <DateFormater dateString={date} />
      </div>
    </header>
  );
};

export default PostHeader;
