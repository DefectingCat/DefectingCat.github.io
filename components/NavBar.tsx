import '@docsearch/css';
import { DocSearch } from '@docsearch/react';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';

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
    name: 'Projects',
    path: '/projects',
  },
  {
    id: 3,
    name: 'Gists',
    path: '/gists',
  },
  {
    id: 4,
    name: 'About',
    path: '/about',
  },
];

/**
 * Check element's id and it's parents
 * @param el
 * @returns
 */
const parentIdChecker = (el: HTMLElement | null): boolean => {
  if (!el) return false;
  if (!el?.id) return parentIdChecker(el.parentElement);
  return (
    !!['menu', 'menu-icon'].filter((item) => item === el.id).length ||
    parentIdChecker(el.parentElement)
  );
};

const HeadBar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const handleClick = () => {
    setShowMenu((showMenu) => !showMenu);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /**
   * Click anywhere to close nav on mobile.
   */
  const handleCloseNav = (e: TouchEvent) => {
    parentIdChecker(e.target as HTMLElement) || setShowMenu(false);
  };
  useEffect(() => {
    window.addEventListener('touchstart', handleCloseNav);
    return () => {
      window.removeEventListener('touchstart', handleCloseNav);
    };
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
          id="menu-icon"
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
            'w-1/3 md:w-auto z-20',
            'md:dark:bg-transparent',
            showMenu || 'hidden'
          )}
          id="menu"
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
              {mounted ? (
                <DocSearch
                  appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? ''}
                  indexName="RUA"
                  apiKey={
                    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ADMIN_KEY ?? ''
                  }
                  placeholder="Search..."
                />
              ) : (
                <div
                  className={cn(
                    'w-[164.453px] h-[30px]',
                    'bg-[#ebedf0] rounded-[40px] animate-pulse'
                  )}
                ></div>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default HeadBar;
