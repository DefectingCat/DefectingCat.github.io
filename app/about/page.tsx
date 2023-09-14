import clsx from 'clsx';
import dynamic from 'next/dynamic';

const AboutModel = dynamic(() => import('components/models/about-model'));

const page = () => {
  return (
    <>
      <AboutModel />

      <main className="h-[calc(100vh-142px)] flex flex-col">
        <div
          className={clsx(
            'flex max-w-3xl',
            'px-10 py-4 mx-auto lg:px-0 lg:py-10',
          )}
        >
          <h1 className="text-5xl font-semibold font-Barlow">About</h1>
        </div>
      </main>
    </>
  );
};

export default page;
