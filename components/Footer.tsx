import React, { FC } from 'react';
import cn from 'classnames';

const YEAR = new Date().getFullYear();

interface Props {
  className?: string;
}

const Footer: FC<Props> = ({ className }) => {
  return (
    <>
      <footer className={cn('text-gray-600 pt-10', className)}>
        <div className={'h-[3px] w-16 rounded-xl bg-gray-400 mb-4'} />

        <p className={'font-semibold mb-2'}>&copy; {YEAR} 小肥羊</p>

        <p className={'text-sm text-gray-400'}>Powered by Next.js ❤️</p>
      </footer>
    </>
  );
};

export default Footer;
