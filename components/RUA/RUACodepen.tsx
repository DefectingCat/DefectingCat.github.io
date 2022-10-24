import classNames from 'classnames';
import useInView from 'lib/hooks/useInView';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import RUALoading from './loading/RUALoading';

export const commonClass = classNames(
  'rounded-lg h-[400px] border-0',
  'overflow-hidden w-full'
);

type Props = {
  defaultTab?: 'html' | 'css' | 'js' | '';
  url: string;
};

const RUACodepen = ({ defaultTab, url }: Props) => {
  const urlArr = url.split('/');
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme ?? 'light';

  const { ref, inView } = useInView();

  const [src, setSrc] = useState('');
  useEffect(() => {
    inView &&
      setSrc(
        `https://codepen.io/${urlArr[3]}/embed/${urlArr[5]}?default-tab=${defaultTab}%2Cresult&theme-id=${currentTheme}`
      );
  }, [currentTheme, defaultTab, inView, urlArr]);

  const [load, setLoad] = useState(false);
  const handleLoad = () => {
    setLoad(true);
  };

  return (
    <>
      <div
        className={classNames(
          commonClass,
          'relative',
          'flex items-center justify-center'
        )}
      >
        <div
          className={classNames(
            commonClass,
            'absolute flex items-center justify-center',
            load && 'hidden',
            'transition-all z-10'
          )}
        >
          <RUALoading />
        </div>

        <div className={classNames('absolute top-0 left-0', commonClass)}>
          <iframe
            ref={ref}
            className={classNames(
              commonClass,
              !load && 'blur-sm',
              'transition-all h-[402px]',
              'border-none',
              'absolute top-1/2 left-1/2',
              '-translate-x-1/2 -translate-y-1/2'
            )}
            style={{
              width: 'calc(100% + 2px)',
            }}
            onLoad={handleLoad}
            scrolling="no"
            src={src}
            frameBorder="no"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default RUACodepen;
