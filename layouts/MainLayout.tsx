import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const Footer = dynamic(() => import('components/Footer'));
const HeadBar = dynamic(() => import('components/NavBar'));
const BackToTop = dynamic(() => import('components/common/BackToTop'));

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  const [showTop, setShowTop] = useState(false);
  const handleScroll = useCallback(() => {
    const target = document.documentElement || document.body;
    const scrollableHeight = target.scrollHeight - target.clientHeight;
    const scrollHeight = target.scrollTop;
    if (scrollHeight / scrollableHeight >= 0.1) {
      setShowTop(true);
    } else {
      setShowTop(false);
    }
  }, []);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <HeadBar />
      {children}
      <Footer />
      {showTop && <BackToTop />}
    </>
  );
};

export default MainLayout;