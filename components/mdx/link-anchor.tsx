import clsx from 'clsx';
import { memo, ReactNode } from 'react';
import { FiExternalLink } from 'react-icons/fi';

interface Props {
  children?: ReactNode;
  external?: boolean;
  className?: string;
}

const Anchor = ({ children, external = true, className }: Props) => {
  return (
    <>
      <span
        className={clsx(
          'mx-[2px] text-teal-500 relative',
          'before:left-0 before:top-[1px] before:block before:absolute',
          'before:w-full before:h-full before:transition-all before:shadow-underline',
          'hover:before:shadow-throughline',
          'dark:text-teal-600',
          className,
        )}
      >
        {children}
        {external && <FiExternalLink className="inline ml-1 mb-[0.2rem]" />}
      </span>
    </>
  );
};

export default memo(Anchor);
