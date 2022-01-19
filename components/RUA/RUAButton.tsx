import { FC } from 'react';
import cn from 'classnames';

interface Props {
  className?: string;
}

const RUAButton: FC<Props> = ({ className, children }) => {
  return (
    <>
      <button
        className={cn(
          'rounded-lg bg-white px-6 py-3 font-semibold',
          'focus:shadow-outline active:bg-gray-100 transition-all',
          'dark:text-gray-400 dark:bg-rua-gray-800 dark:active:bg-gray-600',
          className
        )}
      >
        {children}
      </button>
    </>
  );
};

export default RUAButton;
