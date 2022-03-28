import { AnchorHTMLAttributes } from 'react';
import cn from 'classnames';
import { FiExternalLink } from 'react-icons/fi';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {}

const Anchor = ({ children, ...rest }: Props) => {
  return (
    <>
      <a
        {...rest}
        className={cn(
          'mx-[2px] text-teal-500 relative',
          'before:left-0 before:top-[1px] before:block before:absolute',
          'before:w-full before:h-full before:transition-all before:shadow-underline',
          'hover:before:shadow-throughline',
          'dark:text-teal-600'
        )}
      >
        {children}
      </a>
    </>
  );
};

export default Anchor;
