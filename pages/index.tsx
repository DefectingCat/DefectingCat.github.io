import cn from 'classnames';
import Head from 'next/head';
import { useState } from 'react';
import type { NextPageWithLayout } from 'types';
import style from 'styles/index/index.module.css';
import dynamic from 'next/dynamic';

const MainLayout = dynamic(() => import('layouts/MainLayout'));

const Home: NextPageWithLayout = () => {
  const [showLang, setShowLang] = useState(false);

  return (
    <>
      <Head>
        <title>RUA - HOME</title>
      </Head>

      <main className="min-h-[calc(100vh-142px)] flex justify-center items-center text-xl">
        <div className="z-0 w-full max-w-3xl px-4 my-4 text-2xl md:fixed">
          <div className="max-w-xl leading-10">
            <h1 className="pb-4 text-4xl">Hi there 👋, I&apos;m Arthur. </h1>
            <p>I&apos;m a Fron-end developer. Yes, that&apos;s mean</p>
            <p
              onMouseOver={() => setShowLang(true)}
              onMouseLeave={() => setShowLang(false)}
            >
              <span className={cn('font-Aleo font-semibold', style.gradient)}>
                I make websites{' '}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (and web apps)
              </span>
              <span className="text-sky-500 dark:text-sky-600 font-Aleo">
                .{' '}
              </span>
              The{' '}
              <span className={cn('font-Aleo', showLang && 'hidden')}>
                JavaScript
              </span>
              <span
                className={cn('hidden font-Aleo', showLang && '!inline-block')}
              >
                TypeScript
              </span>{' '}
              is my favorite language.
            </p>
            <p>
              I&apos;m not a creator. Just a little guy standing on the
              shoulders of giants with a little imagination.
            </p>
            <p>
              Open source is my passion. It&apos;s making everything be great.{' '}
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
