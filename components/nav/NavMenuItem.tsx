import { MenuItem } from 'components/NavBar';
import { FC } from 'react';
import Link from 'next/link';
import cn from 'classnames';

interface Props {
  onClick: () => void;
  menuItem: MenuItem;
}

const NavMenuItem: FC<Props> = ({ onClick, menuItem }) => {
  return (
    <>
      <div onClick={onClick}>
        <Link href={menuItem.path} passHref>
          <a
            className={cn(
              'rounded-lg flex items-center my-5 text-lg',
              'text-gray-600 md:text-xl select-none'
            )}
          >
            <menuItem.icon className="mr-10" />
            <span>{menuItem.name}</span>
          </a>
        </Link>
      </div>
    </>
  );
};

export default NavMenuItem;
