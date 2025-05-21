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

      <div className="text-6xl flex items-center">
        <span
          className={clsx(
            'font-semibold font-Lobster tracking-wide',
            styles.gradient,
          )}
        >
          Hello World!
        </span>
        <span className="ml-3">
          <Image
            src="/images/img/hands.svg"
            alt="hands"
            width={36}
            height={36}
          />
        </span>
      </div>
    </main>
  );
}
