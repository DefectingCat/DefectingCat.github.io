import clsx from 'clsx';
import GistsCodeSkeleton from 'components/pages/gists/gists-code-skeleton';

const loading = () => {
  return (
    <>
      <div className="flex items-center py-1 ">
        <div
          className={clsx(
            'w-8 h-8 rounded-lg-full',
            'bg-gray-200 animate-pulse dark:bg-rua-gray-600',
          )}
        ></div>
        <h1
          className={clsx(
            'ml-2 overflow-hidden text-xl',
            'whitespace-nowrap overflow-ellipsis',
            'flex items-center',
          )}
        >
          <div
            className={clsx(
              'w-32 h-5 bg-gray-200',
              'animate-pulse rounded-lg-md',
              'dark:bg-rua-gray-600',
            )}
          ></div>
          <span className="mx-1">/</span>
          <div
            className={clsx(
              'w-32 h-5 bg-gray-200',
              'animate-pulse rounded-lg-md',
              'dark:bg-rua-gray-600',
            )}
          ></div>
        </h1>
      </div>

      <p className="text-gray-400 pl-11 ">
        <div
          className={clsx(
            'w-32 h-4 bg-gray-200',
            'animate-pulse rounded-lg-md',
            'dark:bg-rua-gray-600',
          )}
        ></div>
      </p>

      <div className="py-4">
        <GistsCodeSkeleton />
      </div>
    </>
  );
};

export default loading;
