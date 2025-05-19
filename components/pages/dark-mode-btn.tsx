import clsx from 'clsx';
import { MEDIA } from 'lib/consts';
import useMounted from 'lib/hooks/use-mounted';
import useRuaTheme from 'lib/hooks/use-rua-theme';
import { memo, useCallback, useEffect } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

const DarkModeBtn = () => {
  const { mounted } = useMounted();
  const { theme, setTheme, handleTheme } = useRuaTheme();

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const isDark = e.matches;
      try {
        const localTheme = window.localStorage.getItem('rua-theme');
        if (localTheme) return;
        if (isDark) {
          setTheme('mocha');
        } else {
          setTheme('latte');
        }
        window.localStorage.removeItem('rua-theme');
      } catch (err) {}
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  // Always listen to System preference
  useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  if (!mounted) {
    return (
      <button>
        <div
          className={clsx(
            'w-5 h-5 rounded-lg-md animate-pulse',
            'bg-gray-300 dark:bg-gray-500',
          )}
        ></div>
      </button>
    );
  }

  return (
    <>
      {theme === 'mocha' ? (
        <button>
          <FiSun className="w-5 h-5" onClick={() => handleTheme('latte')} />
        </button>
      ) : (
        <button>
          <FiMoon className="w-5 h-5" onClick={() => handleTheme('mocha')} />
        </button>
      )}
    </>
  );
};

export default memo(DarkModeBtn);
