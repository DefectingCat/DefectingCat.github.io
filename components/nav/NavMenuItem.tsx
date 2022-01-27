import { MenuItem } from 'components/NavBar';
import { FC } from 'react';
import cn from 'classnames';
import dynamic from 'next/dynamic';

const Link = dynamic(() => import('components/PathLink'));

interface Props {
  onClick: () => void;
  menuItem: MenuItem;
}

const NavMenuItem: FC<Props> = ({ onClick, menuItem }) => {
  return (
    <>
      <div onClick={onClick}>
        <Link
          href={menuItem.path}
          className={cn(
            'rounded-lg flex items-center my-5 text-lg font-semibold',
            'text-gray-600 md:text-xl select-none dark:text-gray-400'
          )}
        >
          <menuItem.icon className="mr-9 xl:mr-6 2xl:mr-9" />
          <span>{menuItem.name}</span>
        </Link>
      </div>
    </>
  );
};

export default NavMenuItem;
