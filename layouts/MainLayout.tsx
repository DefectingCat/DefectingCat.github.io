import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('components/Footer'));
const HeadBar = dynamic(() => import('components/NavBar'));

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <HeadBar />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
