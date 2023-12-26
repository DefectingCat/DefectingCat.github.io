'use client';

import clsx from 'clsx';
import CopyButton from 'components/post/copy-button';
import useCopyToClipboard from 'lib/hooks/use-copy-to-clipboard';
import { useCallback, useRef } from 'react';

const CopyCode = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { copy } = useCopyToClipboard();
  const handleCopy = useCallback(() => {
    if (!btnRef.current?.parentElement)
      throw new Error('Can not access pre element.');
    if (btnRef.current.parentElement.textContent == null) return;
    copy(btnRef.current.parentElement.textContent);
  }, [copy]);

  return (
    <>
      <CopyButton
        ref={btnRef}
        className={clsx('absolute top-4 right-4', 'translate-y-[-17%]')}
        onCopy={handleCopy}
      />
    </>
  );
};

export default CopyCode;
