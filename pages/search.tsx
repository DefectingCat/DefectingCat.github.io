import { ChangeEventHandler, ReactElement } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import cn from 'classnames';
import { FiSearch } from 'react-icons/fi';
import { ActionKind, useRUAContext } from '../lib/store';

const MainLayout = dynamic(() => import('layouts/MainLayout'));

const Search = () => {
  const { state, dispatch } = useRUAContext();

  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch({ type: ActionKind.SETQUERY, playload: e.target.value });
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
          value={state.searchQuery}
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
