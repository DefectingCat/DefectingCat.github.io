import { FC } from 'react';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('components/Footer'));
const HeadBar = dynamic(() => import('components/NavBar'));

const MainLayout: FC = ({ children }) => {
  return (
    <>
      <HeadBar />

      <main>{children}</main>

      <Footer />
    </>
  );
};

export default MainLayout;
