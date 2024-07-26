import clsx from 'clsx';
import CopyCode from 'components/post/copy-code';
import { DetailedHTMLProps, HTMLAttributes, memo } from 'react';

type Props = {} & DetailedHTMLProps<
  HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>;

const Pre = ({ ...rest }: Props) => {
  const { children, className, ...props } = rest;

  return (
    <>
      <pre className={clsx(className, 'relative group shadow-card')} {...props}>
        {children}
        <CopyCode />
      </pre>
    </>
  );
};

export default memo(Pre);
