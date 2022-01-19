(() => {
  const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = localStorage.getItem('rua-theme') === 'dark';

  if (isDark || (!('rua-theme' in localStorage) && preferDark)) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('rua-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('rua-theme', 'light');
  }
})();
