import cn from 'classnames';
import Link from 'next/link';
import { FC } from 'react';

const HeadBar: FC = () => {
  return (
    <>
      <header className="flex justify-between max-w-6xl px-6 py-6 mx-auto">
        <Link href="/" passHref>
          <a
            href=""
            className={cn(
              'font-semibold font-Aref-Ruqaa',
              'text-gray-600 text-3xl tracking-widest',
              'select-none'
            )}
          >
            RUA!
          </a>
        </Link>

        <div></div>
      </header>
    </>
  );
};

export default HeadBar;
