import cn from 'classnames';
import Link from 'next/link';
import { FC, useCallback, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { DocSearch } from '@docsearch/react';
import '@docsearch/css';

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
  {
    id: 2,
    name: 'Gists',
    path: '/gists',
  },
  {
    id: 3,
    name: 'About',
    path: '/about',
  },
];

const HeadBar: FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const handleClick = useCallback(() => {
    setShowMenu((showMenu) => !showMenu);
  }, []);

  return (
    <>
      <header
        className={cn(
          'flex justify-between mx-auto',
          'max-w-6xl p-4 xl:px-0 h-[84px]',
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
          onClick={handleClick}
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
            'w-1/3 md:w-auto z-10',
            'md:dark:bg-transparent',
            showMenu || 'hidden'
          )}
        >
          <ul className={cn('flex flex-col ', 'md:flex-row md:items-center')}>
            {txtMenu.map((m) => (
              <li
                key={m.id}
                onClick={handleClick}
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
            <li className="DocSearch-wrapper">
              <DocSearch
                appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? ''}
                indexName="RUA"
                apiKey={process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ADMIN_KEY ?? ''}
                placeholder="Search..."
              />
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default HeadBar;
