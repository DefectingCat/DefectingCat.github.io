import { FC } from 'react';
import cn from 'classnames';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const DarkModeBtn = dynamic(() => import('components/nav/DarkModeBtn'));

const NavAvatar: FC = () => {
  return (
    <>
      <div>
        <div className="w-32 h-32 shadow-lg rounded-full relative">
          <Image
            className="rounded-full overflow-hidden"
            width="128"
            height="128"
            src="/images/img/avatar.svg"
            alt=""
            priority
          />

          {/* Emoji on avatar */}
          <div
            className={cn(
              'w-10 h-10 rounded-full bg-white',
              'absolute right-0 bottom-0 text-lg',
              'flex justify-center items-center',
              'dark:bg-gray-800'
            )}
          >
            ❤️
          </div>
        </div>

        <div className={'flex justify-between items-center pt-4 pb-2'}>
          <h1 className="text-3xl font-semibold">肥羊</h1>
          <DarkModeBtn />
        </div>
        <span className="text-gray-400">恐惧是思维杀手..</span>
      </div>
    </>
  );
};

export default NavAvatar;
