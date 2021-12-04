import { useEffect, useRef, useState } from 'react';

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
