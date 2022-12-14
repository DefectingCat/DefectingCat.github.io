import clsx from 'clsx';
import useInView from 'lib/hooks/useInView';
import { useTheme } from 'next-themes';
import { memo, useEffect, useState } from 'react';
import RUALoading from './loading/RUALoading';

const pattern =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
export const commonClass = clsx(
  'rounded-lg h-[500px] border-0',
  'overflow-hidden w-full'
);

type Props = {
  url: string;
};

const RUACodeSandbox = ({ url }: Props) => {
  const isUrl = pattern.test(url);
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme ?? 'light';

  const { ref, inView } = useInView();
  const embed = new URL(url).pathname.split('/')[2];
  const [src, setSrc] = useState('');
  useEffect(() => {
    inView &&
      setSrc(
        `https://codesandbox.io/embed/${embed}?fontsize=14&hidenavigation=1&theme=${currentTheme}&view=preview`
      );
  }, [currentTheme, embed, inView]);

  const [load, setLoad] = useState(false);
  const handleLoad = () => {
    setLoad(true);
  };

  if (!isUrl) return null;

  return (
    <>
      <div className={clsx(commonClass, 'relative')}>
        <div
          className={clsx(
            commonClass,
            'absolute flex items-center justify-center',
            load && 'hidden',
            'transition-all z-10'
          )}
        >
          <RUALoading />
        </div>

        <iframe
          ref={ref}
          src={src}
          className={clsx(commonClass, !load && 'blur-sm', 'transition-all')}
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          onLoad={handleLoad}
        ></iframe>
      </div>
    </>
  );
};

export default memo(RUACodeSandbox);
