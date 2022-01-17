import { useRouter } from 'next/router';
import { ChangeEventHandler, ReactElement, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import cn from 'classnames';
import { FiSearch } from 'react-icons/fi';

const MainLayout = dynamic(() => import('layouts/MainLayout'));

const Search = () => {
  const router = useRouter();
  const { q } = router.query;

  const [value, setValue] = useState(q);
  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <Head>
        <title>RUA - Search</title>
      </Head>

      <div className="relative text-gray-600">
        <FiSearch
          className={cn(
            'absolute right-3 top-[50%] transform-gpu translate-y-[-50%]',
            'w-6 h-6'
          )}
        />

        <input
          type="text"
          className={cn(
            'rounded-lg bg-white w-full py-7 px-6',
            'outline-none text-lg'
          )}
          value={value}
          onChange={handleInput}
          placeholder="Search something..."
        />
      </div>
    </>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Search;
