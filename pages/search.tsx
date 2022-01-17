import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import dynamic from 'next/dynamic';

const MainLayout = dynamic(() => import('layouts/MainLayout'));

const Search = () => {
  const router = useRouter();
  const { q } = router.query;

  return (
    <>
      <code>{q}</code>
    </>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Search;
