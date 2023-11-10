import clsx from 'clsx';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <main
        className={clsx(
          'flex-1 max-w-4xl px-8 py-8 mx-auto',
          'lg:px-0 w-full flex-1',
        )}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
