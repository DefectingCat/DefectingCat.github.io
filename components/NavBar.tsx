import cn from 'classnames';
import Link from 'next/link';
import { FC, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import dynamic from 'next/dynamic';

const DarkModeBtn = dynamic(() => import('components/DarkModeBtn'));

const txtMenu = [
  {
    id: 0,
    name: 'Home',
    path: '/',
  },
  {
    id: 1,
    name: 'Blog',
    path: '/blog',
  },
];

const HeadBar: FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header
        className={cn(
          'flex justify-between mx-auto',
          'max-w-6xl p-6 lg:px-0 h-[84px]',
          'items-center relative'
        )}
      >
        <Link href="/" passHref>
          <a
            href=""
            className={cn(
              'font-semibold font-Aref-Ruqaa',
              'text-3xl tracking-widest',
              'select-none'
            )}
          >
            RUA!
          </a>
        </Link>

        <FiMenu
          className="cursor-pointer w-7 h-7 md:hidden"
          onClick={() => setShowMenu(!showMenu)}
        />
        <nav
          className={cn(
            'text-lg md:block',
            'bg-white rounded-md',
            'dark:bg-rua-gray-800',
            'absolute md:static',
            'p-5 right-6 top-14',
            'md:bg-transparent md:p-[unset]',
            'md:right-[unset] md:top-[unset]',
            'w-1/3 md:w-auto',
            'md:dark:bg-transparent',
            showMenu || 'hidden'
          )}
        >
          <ul className={cn('flex flex-col', 'md:flex-row')}>
            {txtMenu.map((m) => (
              <li
                key={m.id}
                className={cn('mb-2 last:mb-0 md:mb-0', 'md:mr-4 md:last:mr-0')}
              >
                <Link href={m.path}>{m.name}</Link>
              </li>
            ))}
            <li
              className={cn(
                'mb-2 last:mb-0 md:mb-0',
                'md:mr-4 md:last:mr-0',
                'flex items-center'
              )}
            >
              <DarkModeBtn />
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default HeadBar;
