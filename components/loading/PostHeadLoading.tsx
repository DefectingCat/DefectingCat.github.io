import { FC } from 'react';
import dynamic from 'next/dynamic';
import cn from 'classnames';

const Skeleton = dynamic(() => import('components/RUA/RUASkeleton'));

const tagClass = cn(
  'rounded-md bg-gray-100 px-2 py-1 mr-2 text-sm',
  'text-gray-700 dark:text-gray-300 dark:bg-gray-500'
);

const PostHeadLoading: FC = () => {
  return (
    <>
      <header>
        <div className="mb-4">
          <Skeleton className="h-[2.7rem] w-[60%]" />
        </div>

        <div className="mb-4 flex">
          <Skeleton className={cn(tagClass, 'h-6 !w-16')} />
          <Skeleton className={cn(tagClass, 'h-6 !w-16')} />
        </div>

        <div>
          <Skeleton className="h-4 w-24" />
        </div>
      </header>
    </>
  );
};

export default PostHeadLoading;
