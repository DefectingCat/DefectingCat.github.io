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
    <main className="flex items-stretch justify-center flex-1 text-xl">
      <div className="flex flex-col w-full max-w-4xl px-4 py-24 text-2xl">
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

        <div className="relative flex flex-1 w-full h-full">
          <HomeModel />
        </div>
      </div>
    </main>
  );
}
