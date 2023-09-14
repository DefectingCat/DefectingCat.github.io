import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import styles from 'styles/index/index.module.css';

const HomeModel = dynamic(() => import('components/models/home-model'));

export const metadata = {
  title: 'RUA - Home',
};

export default function Page() {
  return (
    <main className="h-[calc(100vh-142px)] flex justify-center items-center text-xl">
      <div className="flex flex-col w-full h-full max-w-4xl px-4 py-24 text-2xl">
        <h1 className="flex pb-4 text-5xl">
          <span className={clsx('font-semibold font-Lobster', styles.gradient)}>
            Hi there
          </span>
          <span className="ml-3">
            <Image
              src="/images/img/hands.svg"
              alt="hands"
              width={36}
              height={36}
            />
          </span>
        </h1>

        <div className="relative w-full h-full">
          <HomeModel />
        </div>
      </div>
    </main>
  );
}
