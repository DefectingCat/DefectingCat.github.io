import clsx from 'clsx';

const GistSkeleton = () => {
  return (
    <>
      <main className="max-w-5xl px-4 mx-auto lg:px-0">
        <div className="pb-4 text-sm">
          <div className="flex items-center py-1 ">
            <div
              className={clsx(
                'w-8 h-8 rounded-full',
                'animate-pulse bg-gray-300',
                'dark:bg-gray-400 ',
              )}
            ></div>
            <h1
              className={clsx(
                'ml-2 overflow-hidden text-xl',
                'whitespace-nowrap overflow-ellipsis',
                'w-[234px] animate-pulse bg-gray-300',
                'h-6 rounded-lg',
                'dark:bg-gray-400',
              )}
            ></h1>
          </div>

          <p
            className={clsx(
              'ml-10 text-gray-400',
              'w-48 h-4 animate-pulse bg-gray-300',
              'rounded-lg',
              'dark:bg-gray-400',
            )}
          ></p>

          <div className="py-4">
            <p className="pb-2 text-lg text-gray-500">
              <span className={'w-16 animate-pulse'}></span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default GistSkeleton;
