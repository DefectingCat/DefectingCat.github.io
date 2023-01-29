import React, { memo } from 'react';
import clsx from 'clsx';
import loadingImage from 'public/images/img/mona-loading-default.gif';
import loadingImageDimmed from 'public/images/img/mona-loading-dimmed.gif';
import Image from 'next/image';
import { useTheme } from 'next-themes';

type Props = {
  className?: string;
};

const RuaLoading = ({ className: classNames }: Props) => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <div
      className={clsx(
        'flex loading',
        'flex-col items-center justify-center',
        classNames
      )}
    >
      <Image
        width={50}
        height={50}
        priority
        src={currentTheme === 'dark' ? loadingImageDimmed : loadingImage}
        alt="Loading"
      />

      <span className="my-4">rua rua rua...</span>
    </div>
  );
};

export default memo(RuaLoading);
