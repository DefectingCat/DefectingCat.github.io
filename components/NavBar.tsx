import { FC, useCallback, useRef, useState } from 'react';
import cn from 'classnames';
import { FiHome, FiArchive, FiUser, FiSearch } from 'react-icons/fi';
import UseAnimations from 'react-useanimations';
import menu3 from 'react-useanimations/lib/menu3';
import { IconType } from 'react-icons';
import dynamic from 'next/dynamic';

const NavAvatar = dynamic(() => import('components/nav/NavAvatar'));
const NavMenuItem = dynamic(() => import('components/nav/NavMenuItem'));

export type MenuItem = {
  id: number;
  name: string;
  path: string;
  icon: IconType;
};

export const menus: MenuItem[] = [
  {
    id: 0,
    name: '首页',
    path: '/',
    icon: FiHome,
  },
  {
    id: 1,
    name: '归档',
    path: '/archive',
    icon: FiArchive,
  },
  {
    id: 4,
    name: '关于',
    path: '/about',
    icon: FiUser,
  },
  {
    id: 5,
    name: '搜索',
    path: '/search',
    icon: FiSearch,
  },
];

const NavBar: FC = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);
  const onToggle = useCallback(() => {
    setMenuIsOpen((menuIsOpen) => !menuIsOpen);
  }, []);
  // Mobile menu icon must manually clicked to colse when click the menu item.
  const handleMenuClick = useCallback(() => {
    (iconRef.current?.children[0] as HTMLDivElement).click();
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <NavAvatar />

        {/* Mobile menu button */}
        <div className="cursor-pointer md:hidden" ref={iconRef}>
          <UseAnimations
            reverse={menuIsOpen}
            size={40}
            animation={menu3}
            speed={2}
            onClick={onToggle}
          />
        </div>
      </div>

      {/* Menus */}
      <div
        className={cn(
          { hidden: !menuIsOpen },
          'bg-white mx-[-1.5rem] px-6 py-4 mt-4',
          'md:block md:bg-transparent md:mx-0 md:p-0'
        )}
      >
        {menus.map((menu) => (
          <NavMenuItem
            key={menu.id}
            onClick={handleMenuClick}
            menuItem={menu}
          />
        ))}
      </div>
    </>
  );
};

export default NavBar;
