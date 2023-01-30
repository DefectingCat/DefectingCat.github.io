import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('components/footer'));
const HeadBar = dynamic(() => import('components/nav-bar'));
const BackToTop = dynamic(() => import('components/common/back-to-top'));

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
