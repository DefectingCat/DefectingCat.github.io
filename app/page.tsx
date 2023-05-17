import clsx from 'clsx';
import Image from 'next/image';
import styles from 'styles/index/index.module.css';
import dynamic from 'next/dynamic';

const HomeModel = dynamic(() => import('./home-modle'));

export const metadata = {
  title: 'RUA - Home',
};

export default function Page() {
  return (
    <main className="h-[calc(100vh-142px)] flex justify-center items-center text-xl">
      <div className="max-w-4xl flex flex-col w-full h-full  px-4 py-32 text-2xl">
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

        <div className="w-full h-full relative">
          <HomeModel />
        </div>
      </div>
    </main>
  );
}