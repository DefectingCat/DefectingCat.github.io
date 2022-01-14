import cn from 'classnames';
import MainLayout from 'layouts/MainLayout';
import { ReactElement } from 'react';

const Home = () => {
  return <div className={cn('text-red-600')}>Hello</div>;
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
