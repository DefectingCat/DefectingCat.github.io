'use client';

import clsx from 'clsx';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import loadingImage from 'public/images/img/mona-loading-default.gif';
import loadingImageDimmed from 'public/images/img/mona-loading-dimmed.gif';
import { memo } from 'react';

type Props = {
  className?: string;
};

const RUALoading = ({ className: classNames }: Props) => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <div
      className={clsx(
        'flex loading',
        'flex-col items-center justify-center',
        classNames,
      )}
    >
      <Image
        width={50}
        height={50}
        priority
        src={currentTheme === 'dark' ? loadingImageDimmed : loadingImage}
        alt="Loading"
        unoptimized
      />
      <span className="my-4">rua rua rua...</span>
    </div>
  );
};

export default memo(RUALoading);
