import { FC } from 'react';
import MainLayout from 'layouts/MainLayout';

const MDXLayout: FC = ({ children }) => {
  return (
    <>
      <MainLayout>{children}</MainLayout>
    </>
  );
};

export default MDXLayout;
