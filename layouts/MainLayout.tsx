import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('components/Footer'));
const HeadBar = dynamic(() => import('components/NavBar'));
const BackToTop = dynamic(() => import('components/common/BackToTop'));

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <HeadBar />
      {children}
      <Footer />
      <BackToTop />
    </>
  );
};

export default MainLayout;