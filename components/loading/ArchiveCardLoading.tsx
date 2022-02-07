import { FC } from 'react';
import dynamic from 'next/dynamic';
import cn from 'classnames';

const Skeleton = dynamic(() => import('components/RUA/RUASkeleton'));

const ArchiveCardLoading: FC = () => {
  return (
    <>
      <div
        className={cn(
          'h-[100px]',
          'bg-underline bg-bottom bg-no-repeat bg-[length:95%_2px]',
          'duration-300 transition-all',
          'last:bg-none dark:bg-underline-dark dark:last:bg-none',
          'hover:bg-[length:100%_2px]'
        )}
      >
        <div className="p-5">
          <Skeleton className="h-7 w-[45%] mb-4 rounded" />
          <Skeleton className="h-4 w-[20%] rounded" />
        </div>
      </div>
    </>
  );
};

export default ArchiveCardLoading;
