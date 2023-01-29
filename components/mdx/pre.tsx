import clsx from 'clsx';
import CopyButton from 'components/post/copy-button';
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

  const preRef = useRef<HTMLPreElement>(null);
  const { copy } = useCopyToClipboard();
  const handleCopy = useCallback(() => {
    if (!preRef.current) throw new Error('Can not access pre element.');
    if (preRef.current.textContent == null) return;
    copy(preRef.current.textContent);
  }, [copy]);

  return (
    <>
      <pre
        ref={preRef}
        className={clsx(className, 'relative group')}
        {...props}
      >
        {children}
        <CopyButton
          className={clsx('absolute top-4 right-4', 'translate-y-[-17%]')}
          onCopy={handleCopy}
        />
      </pre>
    </>
  );
};

export default memo(Pre);
