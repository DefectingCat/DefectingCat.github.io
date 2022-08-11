import React from 'react';
import cn from 'classnames';
import loadingImage from 'assets/images/img/mona-loading-default.gif';
import loadingImageDimmed from 'assets/images/img/mona-loading-dimmed.gif';
import Image from 'next/image';
import { useTheme } from 'next-themes';

type Props = {
  classNames?: string;
};

const RUALoading = ({ classNames }: Props) => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <div
      className={cn(
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

export default RUALoading;
