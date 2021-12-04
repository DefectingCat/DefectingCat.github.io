import { useCallback, useEffect, useRef, useState } from 'react';

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

  const load = useCallback(
    (entries, observer) => {
      // Lazy load images when they entry the view port.
      entries.forEach((entry: IntersectionObserverEntry) => {
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
    },
    [src]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(load);

    targetRef.current && observer.observe(targetRef.current);

    const cleanRef = targetRef.current;
    // Clean up the images event listener.
    return () => {
      cleanRef &&
        (cleanRef as HTMLElement).removeEventListener('load', cleanBlur);
    };
  }, [load, src]);

  return {
    initSrc,
    blur,
    targetRef,
  };
};

export default useLazyLoad;
