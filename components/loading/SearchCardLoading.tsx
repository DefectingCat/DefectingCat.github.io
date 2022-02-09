import { FC } from 'react';
import dynamic from 'next/dynamic';
import cn from 'classnames';

const Skeleton = dynamic(() => import('components/RUA/RUASkeleton'));

const SearchCardLoading: FC = () => {
  return (
    <>
      <div
        className={cn(
          'rounded-xl overflow-hidden bg-white',
          'mb-6 last:mb-0 transition-shadow duration-500',
          'md:hover:shadow-lg dark:bg-rua-gray-800',
          'p-6'
        )}
      >
        <Skeleton className="h-8 w-[35%] mb-4" />
        <Skeleton className="h-16" />
      </div>
    </>
  );
};

export default SearchCardLoading;
