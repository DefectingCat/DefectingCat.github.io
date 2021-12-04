import { useEffect, useRef, useState } from 'react';

/**
 * Check target DOM whether in the viewport.
 * @returns
 */
const useIntersection = () => {
  const targetRef = useRef(null);

  const [intersect, setIntersect] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (targetRef.current) {
            setIntersect(true);
            observer.unobserve(targetRef.current);
          }
        }
      });
    });

    targetRef.current && observer.observe(targetRef.current);
  }, []);

  return {
    targetRef,
    intersect,
  };
};

export default useIntersection;
