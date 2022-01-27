import { FC } from 'react';
import cn from 'classnames';

interface Props {
  className?: string;
}

const RUASeleton: FC<Props> = ({ className }) => {
  return (
    <>
      <div
        className={cn(
          'bg-slate-200 animate-pulse rounded-lg dark:bg-slate-400 w-full',
          className
        )}
      ></div>
    </>
  );
};

export default RUASeleton;
