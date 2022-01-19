import React, { FC, useCallback } from 'react';
import { ActionKind, useRUAContext } from 'lib/store';
import Link from 'next/link';

interface Props {
  href: string;
  className?: string;
}

/**
 * Record from path to global state.
 * @param href target href.
 * @param className style will be applied to a tag.
 * @param children
 * @constructor
 */
const PathLink: FC<Props> = ({ href, className, children }) => {
  const { dispatch } = useRUAContext();
  const handleClick = useCallback(() => {
    dispatch({ type: ActionKind.SETPATH, payload: document.location.pathname });
  }, [dispatch]);

  return (
    <Link href={href} passHref>
      <a className={className} onClick={handleClick}>
        {children}
      </a>
    </Link>
  );
};

export default PathLink;
