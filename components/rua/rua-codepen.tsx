'use client';

import clsx from 'clsx';
import useInView from 'lib/hooks/use-in-view';
import { useTheme } from 'next-themes';
import { memo, useEffect, useState } from 'react';
import RUALoading from './loading/rua-loading';

export const commonClass = clsx(
  'rounded-lg h-[400px] border-0',
  'overflow-hidden w-full',
);

type Props = {
  defaultTab?: 'html' | 'css' | 'js' | '';
  url: string;
};

const RUACodepen = ({ defaultTab, url }: Props) => {
  const urlArr = url.split('/');
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : (theme ?? 'light');

  const { ref, inView } = useInView();

  const [src, setSrc] = useState('');
  useEffect(() => {
    inView &&
      setSrc(
        `https://codepen.io/${urlArr[3]}/embed/${urlArr[5]}?default-tab=${defaultTab}%2Cresult&theme-id=${currentTheme}`,
      );
  }, [currentTheme, defaultTab, inView, urlArr]);

  const [load, setLoad] = useState(false);
  const handleLoad = () => {
    setLoad(true);
  };

  return (
    <>
      <div
        className={clsx(
          commonClass,
          'relative',
          'flex items-center justify-center',
        )}
      >
        <div
          className={clsx(
            commonClass,
            'absolute flex items-center justify-center',
            load && 'hidden',
            'transition-all z-10',
          )}
        >
          <RUALoading />
        </div>

        <div className={clsx('absolute top-0 left-0', commonClass)}>
          <iframe
            ref={ref}
            className={clsx(
              commonClass,
              !load && 'blur-sm',
              'transition-all h-[402px]',
              'border-none',
              'absolute top-1/2 left-1/2',
              '-translate-x-1/2 -translate-y-1/2',
              'overflow-hidden',
            )}
            style={{
              width: 'calc(100% + 2px)',
            }}
            onLoad={handleLoad}
            src={src}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default memo(RUACodepen);
