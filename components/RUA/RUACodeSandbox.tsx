import classNames from 'classnames';
import useInView from 'lib/hooks/useInView';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import RUALoading from './loading/RUALoading';

const partten =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
const commonClass = classNames(
  'rounded-lg h-[500px] border-0',
  'overflow-hidden w-full'
);

type Props = {
  url: string;
};

const RUACodeSandbox = ({ url }: Props) => {
  const isUrl = partten.test(url);
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
  const handleLoad = useCallback(() => {
    setLoad(true);
  }, []);

  if (!isUrl) return null;

  return (
    <>
      <div className={classNames(commonClass, 'relative')}>
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

        <iframe
          ref={ref}
          src={src}
          className={classNames(
            commonClass,
            !load && 'blur-sm',
            'transition-all'
          )}
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          onLoad={handleLoad}
        ></iframe>
      </div>
    </>
  );
};

export default RUACodeSandbox;