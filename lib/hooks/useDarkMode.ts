import { useEffect, useState } from 'react';

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rua-theme', 'light');
      setIsDark(document.documentElement.classList.contains('dark'));
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rua-theme', 'dark');
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  };

  return { isDark, toggleDark };
};
export default useDarkMode;
