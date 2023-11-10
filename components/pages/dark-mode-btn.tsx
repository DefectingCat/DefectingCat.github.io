import clsx from 'clsx';
import useMounted from 'lib/hooks/use-mounted';
import { useTheme } from 'next-themes';
import { memo } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

const DarkModeBtn = () => {
  const { mounted } = useMounted();
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const handleTheme = (type: 'light' | 'dark') => () => {
    const map = {
      light: 'latte',
      dark: 'mocha',
    };
    document.body.className = map[type];
    setTheme(type);
  };

  if (!mounted) {
    return (
      <button>
        <div
          className={clsx(
            'w-5 h-5 rounded-md animate-pulse',
            'bg-gray-300 dark:bg-gray-500',
          )}
        ></div>
      </button>
    );
  }

  return (
    <>
      {currentTheme === 'dark' ? (
        <button>
          <FiSun className="w-5 h-5" onClick={handleTheme('light')} />
        </button>
      ) : (
        <button>
          <FiMoon className="w-5 h-5" onClick={handleTheme('dark')} />
        </button>
      )}
    </>
  );
};

export default memo(DarkModeBtn);
