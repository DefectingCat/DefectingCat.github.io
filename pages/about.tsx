import dynamic from 'next/dynamic';
import { NextPageWithLayout } from 'types';
import avatar from 'public/images/img/avatar.svg';
import Image from 'next/image';
import classNames from 'classnames';

const MainLayout = dynamic(() => import('layouts/MainLayout'));

const About: NextPageWithLayout = () => {
  return (
    <>
      <main className="h-[calc(100vh-142px)] flex flex-col">
        <div
          className={classNames(
            'flex items-center max-w-3xl',
            'px-10 py-4 mx-auto lg:px-0 lg:py-10'
          )}
        >
          <div className="w-16 h-16 lg:w-[72px] lg:h-[72px]">
            <Image
              src={avatar}
              alt="Avatar"
              priority
              width={72}
              height={72}
              className="rounded-full"
            />
          </div>

          <div className="pl-4 text-xl lg:text-2xl lg:pl-10">
            <h1 className="font-semibold font-Barlow">
              Arthur / Defectink / xfy
            </h1>
            <div className="h-[1px] rounded-lg bg-gray-400"></div>
            <div className="text-base lg:text-lg">
              Long may the sun shine ☀️
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

About.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default About;
