import { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { FiHome } from 'react-icons/fi';
import Image from 'next/image';
import UseAnimations from 'react-useanimations';
import menu3 from 'react-useanimations/lib/menu3';

import NavAvatar from 'components/nav/NavAvatar';

const NavBar: FC = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const onToggle = useCallback(() => {
    setMenuIsOpen((menuIsOpen) => !menuIsOpen);
  }, []);

  return (
    <>
      <div
        className={cn(
          'col-span-12',
          'md:col-span-3 lg:col-span-2 xl:col-span-1'
        )}
      >
        <div className="flex justify-between">
          <NavAvatar />

          <div className="cursor-pointer md:hidden">
            <UseAnimations
              reverse={menuIsOpen}
              size={40}
              animation={menu3}
              speed={2}
              onClick={onToggle}
            />
          </div>
        </div>

        <div className={cn({ hidden: !menuIsOpen }, 'md:block')}>
          this is nav
        </div>
      </div>
    </>
  );
};

export default NavBar;
