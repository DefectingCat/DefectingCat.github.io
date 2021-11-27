import { useEffect, useRef, useState } from 'react';

/**
 * Use IntersectionObserver API to lazy load taget DOM.
 * @param src src path
 * @param blurPx blur px
 * @returns
 */
const useLazyLoad = (src: string, blurPx = '10px') => {
  const targetRef = useRef(null);
  const [blur, setBlur] = useState(`blur(${blurPx})`);

  const [initSrc, setInitSrc] = useState(
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
  );

  const cleanBlur = () => {
    setBlur('unset');
  };

  useEffect(() => {
    // Lazy load images when they entry the view port.
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (targetRef.current) {
            setInitSrc(src);
            observer.unobserve(targetRef.current);
            (targetRef.current as HTMLElement).addEventListener(
              'load',
              cleanBlur
            );
          }
        }
      });
    });

    targetRef.current && observer.observe(targetRef.current);

    const cleanRef = targetRef.current;
    // Clean up the images event listener.
    return () => {
      cleanRef &&
        (cleanRef as HTMLElement).removeEventListener('load', cleanBlur);
    };
  }, [src]);

  return {
    initSrc,
    blur,
    targetRef,
  };
};

export default useLazyLoad;
