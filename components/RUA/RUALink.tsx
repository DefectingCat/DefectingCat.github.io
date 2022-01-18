/* eslint-disable react/jsx-no-target-blank */
import { FC } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import cn from 'classnames';

interface Props {
  href: string;
  isExternal?: boolean;
}

const RUALink: FC<Props> = ({ href, isExternal = false, children }) => {
  return (
    <>
      <a
        href={href}
        target={isExternal ? '_blank' : ''}
        rel={isExternal ? 'noreferrer' : 'noopener'}
        className={cn(
          'mx-[2px] text-teal-500 relative',
          'before:left-0 before:top-[1px] before:block before:absolute',
          'before:w-full before:h-full before:transition-all before:shadow-underline',
          'hover:before:shadow-throughline'
        )}
      >
        {children}
        {isExternal && <FiExternalLink className="inline mx-[2px]" />}
      </a>
    </>
  );
};

export default RUALink;
