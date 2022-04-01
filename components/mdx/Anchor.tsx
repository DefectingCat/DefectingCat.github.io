import { AnchorHTMLAttributes } from 'react';
import cn from 'classnames';
import { FiExternalLink } from 'react-icons/fi';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
}

const Anchor = ({ children, external = true, ...rest }: Props) => {
  return (
    <>
      <a
        {...rest}
        target={external ? '_blank' : undefined}
        className={cn(
          'mx-[2px] text-teal-500 relative',
          'before:left-0 before:top-[1px] before:block before:absolute',
          'before:w-full before:h-full before:transition-all before:shadow-underline',
          'hover:before:shadow-throughline',
          'dark:text-teal-600'
        )}
      >
        {children}
        {external && <FiExternalLink className="inline ml-1 mb-[0.2rem]" />}
      </a>
    </>
  );
};

export default Anchor;
