import { FC } from 'react';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import Sticky from 'react-stickynode';
import useMediaQuery from 'lib/hooks/useMediaQuery';

const NavBar = dynamic(() => import('components/NavBar'));
const InfoBar = dynamic(() => import('components/InfoBar'));
const Footer = dynamic(() => import('components/Footer'));

const MainLayout: FC = ({ children }) => {
  const matched = useMediaQuery('(max-width: 640px)');

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-12 container mx-auto px-4 py-8 items-stretch',
          'md:gap-4',
          'xl:grid-cols-8'
        )}
      >
        <aside
          className={cn(
            'col-span-12 px-2',
            'md:col-span-3 lg:col-span-2 xl:col-span-1'
          )}
        >
          <Sticky enabled={!matched} top={32}>
            <NavBar />
          </Sticky>
        </aside>

        <main
          className={cn(
            'col-span-12 mt-4',
            'md:col-span-9 md:mt-0 xl:col-span-5',
            'lg:col-span-10 lg:px-10'
          )}
        >
          {children}

          <Footer />
        </main>

        <aside className={cn('hidden', 'xl:block xl:col-span-2')}>
          <Sticky enabled={!matched} top={32}>
            <InfoBar />
          </Sticky>
        </aside>
      </div>
    </>
  );
};

export default MainLayout;
