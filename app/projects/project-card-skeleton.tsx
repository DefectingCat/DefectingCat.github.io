import clsx from 'clsx';
import { VscGithubInverted } from 'react-icons/vsc';

const PojectCardSkeleton = () => {
  return (
    <>
      <div
        className={clsx(
          'py-3 px-4 rounded-lg bg-slate-100',
          'hover:bg-slate-200',
          'transition-all duration-300',
          'flex items-center cursor-pointer',
          'justify-between dark:bg-rua-gray-800',
          'hover:dark:bg-rua-gray-700'
        )}
      >
        <VscGithubInverted className="w-8 h-8" />

        <a className="w-[calc(100%_-_40px)]" target="_blank" rel="noreferrer">
          <h2
            className={clsx(
              'text-xl overflow-hidden',
              'text-ellipsis whitespace-nowrap',
              'h-6 w-[100px] animate-pulse',
              'bg-gray-300 rounded-lg'
            )}
          ></h2>
          <span
            className={clsx(
              'overflow-hidden break-keep text-ellipsis',
              'whitespace-nowrap inline-block',
              'w-[inherit] mt-1',
              'h-5 w-[300px] animate-pulse',
              'bg-gray-300 rounded-lg'
            )}
          ></span>
        </a>
      </div>
    </>
  );
};

export default PojectCardSkeleton;
