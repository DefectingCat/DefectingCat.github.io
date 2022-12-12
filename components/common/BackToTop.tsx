import clsx from 'clsx';
import Button from 'components/RUA/Button';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FiChevronUp } from 'react-icons/fi';

const BackToTop = () => {
  const handleBack = () => {
    const target = document.documentElement || document.body;
    target.scrollTo({
      top: 0,
    });
  };

  const [showTop, setShowTop] = useState(false);
  const lastScrollTop = useRef(0);
  const handleScroll = useCallback(() => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop.current || st <= 0) {
      // downscroll
      setShowTop(false);
    } else {
      // upscroll
      setShowTop(true);
    }
    lastScrollTop.current = st <= 0 ? 0 : st;
  }, []);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <Button
        onClick={handleBack}
        className={clsx(
          '!p-3 fixed',
          'right-4 bottom-4',
          'lg:right-8 lg:bottom-8',
          'transition-all duration-300',
          showTop ? 'visible scale-100' : 'invisible scale-0'
        )}
      >
        <FiChevronUp className="w-6 h-6" />
      </Button>
    </>
  );
};

export default memo(BackToTop);