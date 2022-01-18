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
      <h1 className={'text-3xl md:text-4xl font-semibold text-gray-700 mb-4'}>
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
                  'text-gray-700 mr-3'
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
                  'text-gray-700'
                )}
              >
                {tags}
              </div>
            )}
      </div>

      <div className={'flex items-center text-gray-600 text-sm'}>
        <FiCalendar className={'mr-2'} />
        <DateFormater dateString={date} />
      </div>
    </header>
  );
};

export default PostHeader;
