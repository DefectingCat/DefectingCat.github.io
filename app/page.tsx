import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import styles from 'styles/index/index.module.css';

const ComputerDesk = dynamic(
  () => import('components/models/home/computer-desk'),
);

export const metadata = {
  title: 'RUA - Home',
};

export default function Page() {
  return (
    <main className="flex items-stretch justify-center flex-1 text-xl">
      <div className={clsx('top-0 left-0 right-0 bottom-0 absolute')}>
        <ComputerDesk />
      </div>

      <div className="text-center pt-20">
        <h1
          className={clsx(
            'font-semibold font-Lobster tracking-wide',
            'pb-12 text-5xl sm:text-6xl',
            styles.gradient,
          )}
        >
          Hello World
        </h1>
        <h2
          className={clsx(
            'font-semibold font-Lobster tracking-wide',
            'text-4xl sm:text-5xl',
          )}
        >
          TECH OTAKUS SAVE THE WORLD
        </h2>
      </div>
    </main>
  );
}
