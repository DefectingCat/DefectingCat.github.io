import clsx from 'clsx';
import React, { memo } from 'react';

export type ItemProps = {
  value: string | number;
  label: string | number;
  showContent?: boolean;
  children?: React.ReactNode;
};

const TabItem = ({ showContent, children }: ItemProps) => {
  return (
    <>
      <div className={clsx('hidden', showContent && '!block')}>{children}</div>
    </>
  );
};

export default memo(TabItem);
