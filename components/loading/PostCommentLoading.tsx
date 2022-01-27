import React, { FC } from 'react';
import dynamic from 'next/dynamic';

const Skeleton = dynamic(() => import('components/RUA/RUASkeleton'));

const PostCommentLoading: FC = () => {
  return (
    <div className="h-[346px] md:h-[350px] flex flex-col overflow-hidden">
      <div className="h-[60px] mt-8 mb-4 flex flex-col items-center justify-center">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-7 w-7 rounded-full mt-2" />
      </div>

      <div className="flex-1 flex flex-col">
        <Skeleton className="h-8 w-24 mb-2" />
        <hr className="my-2" />

        <div className="flex-1 flex flex-col">
          <Skeleton className="h-[45px]" />
          <Skeleton className="mt-2 flex-1" />
        </div>
      </div>
    </div>
  );
};

export default PostCommentLoading;
