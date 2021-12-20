import { useEffect, useRef, useState } from 'react';

/**
 * Check target DOM whether in the viewport.
 * @returns
 */
const useIntersection = () => {
  const targetRef = useRef(null);

  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (targetRef.current) {
            setInView(true);
            observer.unobserve(targetRef.current);
          }
        }
      });
    });

    targetRef.current && observer.observe(targetRef.current);
  }, []);

  return {
    targetRef,
    inView,
  };
};

export default useIntersection;
