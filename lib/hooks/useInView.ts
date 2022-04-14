import { useEffect, useRef, useState } from 'react';

const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (ref.current) {
            setInView(true);
            observer.unobserve(ref.current);
          }
        }
      });
    });

    ref.current && observer.observe(ref.current);
  }, []);

  return { ref, inView };
};

export default useInView;
