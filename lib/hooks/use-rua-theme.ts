import { MEDIA, THEME_MAP } from 'lib/consts';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';

const useRuaTheme = () => {
  const { theme, setTheme } = useTheme();
  const handleTheme = useCallback((type: 'latte' | 'mocha') => {
    const media = window.matchMedia(MEDIA);
    const system = media.matches ? 'dark' : 'light';
    setTheme(type);
    if (THEME_MAP[system] === type) {
      try {
        window.localStorage.removeItem('rua-theme');
      } catch (err) {
        console.error(err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    theme,
    setTheme,
    handleTheme,
  };
};

export default useRuaTheme;
