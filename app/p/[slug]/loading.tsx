import clsx from 'clsx';
import dynamic from 'next/dynamic';

const PostToc = dynamic(() => import('components/post/post-toc'));
const lines = Array(4).fill(null);

const Page = async () => {
  return (
    <>
      <main
        id="article"
        className={clsx(
          'relative max-w-4xl px-4 mx-auto my-10',
          'lg:w-[56rem] w-full flex-1',
          'mt-8',
        )}
      >
        <div className="flex flex-col items-center">
          <h1
            className={clsx(
              'w-[500px] h-12 bg-gray-300',
              'dark:bg-gray-500 rounded-lg animate-pulse',
            )}
          ></h1>
          <time
            className={clsx(
              'mt-8 mb-10 w-40',
              'rounded-lg bg-gray-300',
              'dark:bg-gray-500 animate-pulse',
              'h-3',
            )}
          ></time>
        </div>

        <PostToc toc={[]} tocLength={0} />

        {lines.map((_, i) => (
          <div
            className={clsx(
              'h-4 w-full bg-gray-200',
              'animate-pulse rounded-lg',
              'dark:bg-rua-gray-700',
              'mb-2',
            )}
            key={i}
          ></div>
        ))}

        <div
          className={clsx(
            'h-4 w-64 bg-gray-200',
            'animate-pulse rounded-lg',
            'dark:bg-rua-gray-700',
            'mb-2',
          )}
        ></div>
      </main>
    </>
  );
};

export default Page;
