import { FC } from 'react';
import cn from 'classnames';

const MainLayout: FC = ({ children }) => {
  return (
    <>
      <div
        className={cn(
          'grid grid-cols-12 container mx-auto p-2',
          'md:grid-cols-8'
        )}
      >
        {children}
      </div>
    </>
  );
};

export default MainLayout;
