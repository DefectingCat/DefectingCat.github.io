import { useCallback, useEffect, useRef, useState } from 'react';

const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  const observeCallback: IntersectionObserverCallback = useCallback(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!ref.current) return;
        setInView(true);
        observer.unobserve(ref.current);
      });
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observeCallback);

    ref.current && observer.observe(ref.current);
  }, [observeCallback]);

  return { ref, inView };
};

export default useInView;
