import { FC } from 'react';
import cn from 'classnames';

interface Props {
  allPages: number;
  num?: string;
}

const RUAButton: FC = ({ children }) => {
  return (
    <>
      <button
        className={cn(
          'rounded-lg bg-white px-6 py-3 font-semibold',
          'focus:shadow-outline active:bg-gray-100 transition-all'
        )}
      >
        {children}
      </button>
    </>
  );
};

export default RUAButton;
