import clsx from 'clsx';
import useCopyToClipboard from 'lib/hooks/useCopyToClipboard';
import { DetailedHTMLProps, HTMLAttributes, lazy, useRef } from 'react';

const CopyButton = lazy(() => import('components/post/CopyButton'));

type Props = {} & DetailedHTMLProps<
  HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>;

const Pre = ({ ...rest }: Props) => {
  const { children, className, ...props } = rest;

  const preRef = useRef<HTMLPreElement>(null);
  const { copy } = useCopyToClipboard();
  const handleCopy = () => {
    if (!preRef.current) throw new Error('Can not access pre element.');
    if (preRef.current.textContent == null) return;
    copy(preRef.current.textContent);
  };

  return (
    <>
      <pre
        ref={preRef}
        className={clsx(className, 'relative group')}
        {...props}
      >
        {children}
        <CopyButton onCopy={handleCopy} />
      </pre>
    </>
  );
};

export default Pre;
