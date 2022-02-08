import {
  ChangeEventHandler,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import cn from 'classnames';
import { FiSearch } from 'react-icons/fi';
import { ActionKind, useRUAContext } from 'lib/store';
import debounce from 'lib/utils/debounce';
import { search } from 'lib/API';
import { SearchType } from 'lib/API/types';

const MainLayout = dynamic(() => import('layouts/MainLayout'));

const Search = () => {
  const { state, dispatch } = useRUAContext();

  const [searchResult, setSearchResult] = useState<SearchType>();
  const querySearch = async (q: string, page = 1) => {
    const result = await search(q, page);

    if (result?.message == 'ok') {
      setSearchResult(result);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(debounce(querySearch, 350), []);

  const handleInput: ChangeEventHandler<HTMLInputElement> = async (e) => {
    dispatch({ type: ActionKind.SETQUERY, payload: e.target.value });
  };

  useEffect(() => {
    debounceSearch(state.searchQuery, 1);
  }, [debounceSearch, state.searchQuery]);

  return (
    <>
      <Head>
        <title>RUA - Search</title>
      </Head>

      <div className="relative text-gray-700 dark:text-gray-400">
        <input
          type="text"
          className={cn(
            'rounded-lg bg-white w-full py-7 px-6',
            'outline-none text-lg',
            'dark:bg-rua-gray-800'
          )}
          value={state.searchQuery}
          onChange={handleInput}
          placeholder="Search something..."
        />

        <FiSearch
          className={cn(
            'absolute right-6 top-[50%] transform-gpu translate-y-[-50%]',
            'w-6 h-6'
          )}
        />
      </div>

      <div className="mt-4">
        {searchResult?.result.map((result) => (
          <p key={result.id}>{result.title}</p>
        ))}
      </div>
    </>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Search;
