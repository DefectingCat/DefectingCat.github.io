import { FC } from 'react';
import cn from 'classnames';

const NavBar: FC = () => {
  return (
    <>
      <div
        className={cn(
          'col-span-12',
          'md:col-span-3 lg:col-span-2 xl:col-span-1'
        )}
      >
        this is nav
      </div>
    </>
  );
};

export default NavBar;
