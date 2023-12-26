import clsx from 'clsx';
import CopyButton from 'components/post/copy-button';
import CopyCode from 'components/post/copy-code';
import useCopyToClipboard from 'lib/hooks/use-copy-to-clipboard';
import {
  DetailedHTMLProps,
  HTMLAttributes,
  memo,
  useCallback,
  useRef,
} from 'react';

type Props = {} & DetailedHTMLProps<
  HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>;

const Pre = ({ ...rest }: Props) => {
  const { children, className, ...props } = rest;

  return (
    <>
      <pre className={clsx(className, 'relative group')} {...props}>
        {children}
        <CopyCode />
      </pre>
    </>
  );
};

export default memo(Pre);
