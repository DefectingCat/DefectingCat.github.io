import { AnchorHTMLAttributes, forwardRef, memo } from 'react';
import clsx from 'clsx';
import { FiExternalLink } from 'react-icons/fi';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
}

const Anchor = forwardRef<HTMLAnchorElement, Props>(
  ({ children, external = true, ...rest }, ref) => {
    return (
      <>
        <a
          ref={ref}
          {...rest}
          className="inline-block"
          target={external ? '_blank' : undefined}
        >
          <span
            className={clsx(
              'mx-[2px] text-teal-500 relative',
              'before:left-0 before:top-[1px] before:block before:absolute',
              'before:w-full before:h-full before:transition-all before:shadow-underline',
              'hover:before:shadow-throughline',
              'dark:text-teal-600'
            )}
          >
            {children}
            {external && <FiExternalLink className="inline ml-1 mb-[0.2rem]" />}
          </span>
        </a>
      </>
    );
  }
);

Anchor.displayName = 'Anchor';

export default memo(Anchor);