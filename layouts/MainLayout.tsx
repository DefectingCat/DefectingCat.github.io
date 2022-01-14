import { FC } from 'react';
import cn from 'classnames';
import NavBar from 'components/NavBar';

const MainLayout: FC = ({ children }) => {
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
          <NavBar />
        </aside>

        <main
          className={cn(
            'col-span-12 mt-4',
            'md:col-span-9 md:mt-0 xl:col-span-5',
            'lg:col-span-10 lg:px-10'
          )}
        >
          {children}
        </main>

        <aside className={cn('hidden', 'xl:block xl:col-span-2')}></aside>
      </div>
    </>
  );
};

export default MainLayout;
