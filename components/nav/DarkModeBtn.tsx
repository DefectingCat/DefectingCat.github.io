import React, { FC } from 'react';
import cn from 'classnames';
import { FiSun, FiMoon } from 'react-icons/fi';
import useDarkMode from 'lib/hooks/useDarkMode';

interface Props {
  className?: string;
}

const DarkModeBtn: FC<Props> = ({ className }) => {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <button
      aria-label={'Dark mode button'}
      className={cn(
        'rounded-xl p-[10px] aspect-square text-2xl',
        'focus:shadow-outline active:bg-gray-100 transition-all',
        'dark:text-gray-400 dark:active:bg-gray-600',
        'hover:bg-gray-200 dark:hover:bg-rua-gray-600',
        className
      )}
      onClick={() => toggleDark()}
    >
      {isDark ? <FiMoon /> : <FiSun />}
    </button>
  );
};

export default DarkModeBtn;
