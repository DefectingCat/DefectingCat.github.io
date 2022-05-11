import classNames from 'classnames';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

const DarkModeBtn = () => {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  if (!mounted)
    return (
      <button>
        <div
          className={classNames(
            'w-5 h-5 rounded-md animate-pulse',
            'bg-gray-300 dark:bg-gray-500'
          )}
        ></div>
      </button>
    );

  return (
    <>
      {currentTheme === 'dark' ? (
        <button>
          <FiSun className="w-5 h-5" onClick={() => setTheme('light')} />
        </button>
      ) : (
        <button>
          <FiMoon className="w-5 h-5" onClick={() => setTheme('dark')} />
        </button>
      )}
    </>
  );
};

export default DarkModeBtn;
