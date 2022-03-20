import { FC } from 'react';
import HeadBar from 'components/NavBar';

const MainLayout: FC = ({ children }) => {
  return (
    <>
      <HeadBar />

      <main>{children}</main>
    </>
  );
};

export default MainLayout;
