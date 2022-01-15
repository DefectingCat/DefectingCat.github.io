import { useCallback, useEffect, useState } from 'react';

const useMediaQuery = (query: string) => {
  const [matched, setMatched] = useState(false);

  const reportWindowSize = useCallback(() => {
    setMatched(window.matchMedia(query).matches);
  }, [query]);

  useEffect(() => {
    setMatched(window.matchMedia(query).matches);
    window.addEventListener('resize', reportWindowSize);

    return () => window.removeEventListener('resize', reportWindowSize);
  }, [query, reportWindowSize]);

  return matched;
};

export default useMediaQuery;
