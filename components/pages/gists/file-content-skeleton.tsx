import clsx from 'clsx';

export default function FileContentLoading() {
  return (
    <div className={clsx('pb-4 w-full')}>
      {/* Username */}
      <h1
        className={clsx(
          'md:text-lg h-7 bg-gray-200',
          'animate-pulse w-48 rounded-lg',
          'dark:bg-rua-gray-700',
          'mb-2',
        )}
      ></h1>
      {/* last active */}
      <div
        className={clsx(
          'h-4 w-72 bg-gray-200',
          'animate-pulse rounded-lg',
          'dark:bg-rua-gray-700',
        )}
      ></div>
      {/* code block */}
      <div
        className={clsx(
          'w-full h-[488px] rounded-lg',
          'animate-pulse dark:bg-rua-gray-700',
          'mt-3 bg-gray-200',
        )}
      ></div>
    </div>
  );
}
