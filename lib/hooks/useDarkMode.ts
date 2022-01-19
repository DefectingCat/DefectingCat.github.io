import { ActionKind, useRUAContext } from '../store';

const useDarkMode = () => {
  const { state, dispatch } = useRUAContext();
  const { isDark } = state;

  const toggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rua-theme', 'light');
      dispatch({
        type: ActionKind.SETTHEME,
        payload: '',
      });
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rua-theme', 'dark');
      dispatch({
        type: ActionKind.SETTHEME,
        payload: '',
      });
    }
  };

  return { isDark, toggleDark };
};
export default useDarkMode;
