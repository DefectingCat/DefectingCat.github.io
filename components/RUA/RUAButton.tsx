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
          className
        )}
      >
        {children}
      </button>
    </>
  );
};

export default RUAButton;
