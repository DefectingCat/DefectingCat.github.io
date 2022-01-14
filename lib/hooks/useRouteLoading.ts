import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useRouterLoading = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = useCallback(
    (url: string) => {
      url !== router.pathname ? setLoading(true) : setLoading(false);
    },
    [router.pathname]
  );

  const handleComplete = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [handleComplete, handleStart, router.events]);

  return [loading];
};

export default useRouterLoading;