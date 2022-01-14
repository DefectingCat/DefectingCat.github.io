import { FC } from 'react';
import cn from 'classnames';
import Image from 'next/image';

const NavAvatar: FC = () => {
  return (
    <>
      <div>
        <div className={cn('w-32 h-32 shadow-lg', 'rounded-full relative')}>
          <Image
            className="rounded-full overflow-hidden"
            width="128"
            height="128"
            src="/images/img/avatar.svg"
            alt=""
          />
          <div
            className={cn(
              'w-10 h-10 rounded-full bg-white',
              'absolute right-0 bottom-0',
              'flex justify-center items-center'
            )}
          >
            <Image
              width="20"
              height="17"
              src="/images/img/sparkling-heart.png"
              alt=""
            />
          </div>
        </div>

        <h1 className={cn('text-3xl font-semibold mt-4 mb-2')}>肥羊</h1>
        <span className="text-gray-400">恐惧是思维杀手..</span>
      </div>
    </>
  );
};

export default NavAvatar;
