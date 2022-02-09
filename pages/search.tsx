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
import InfiniteScroll from 'react-infinite-scroll-component';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const SearchCard = dynamic(() => import('components/SearchCard'));
const SearchCardLoading = dynamic(
  () => import('components/loading/SearchCardLoading')
);

const Search = () => {
  const { state, dispatch } = useRUAContext();

  // Search result
  const [searchResult, setSearchResult] = useState<SearchType>();
  // Search state
  const [searching, setSearching] = useState(false);
  const querySearch = async (q: string, page = 1) => {
    setSearching(true);
    const result = await search(q, page);

    if (result?.message == 'ok') {
      setSearching(false);
      setSearchResult(result);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(debounce(querySearch, 350), []);

  const handleInput: ChangeEventHandler<HTMLInputElement> = async (e) => {
    dispatch({ type: ActionKind.SETQUERY, payload: e.target.value });
  };

  const loadMore = async () => {
    const result = await search(
      state.searchQuery,
      Number(searchResult?.page) + 1
    );
    if (result?.message == 'ok' && searchResult?.result) {
      const newData = [...searchResult.result, ...result.result];
      setSearchResult({ ...searchResult, ...result, result: newData });
    }
  };

  useEffect(() => {
    if (state.searchQuery) debounceSearch(state.searchQuery, 1);
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

      <div className="mt-6">
        {searching ? (
          <SearchCardLoading />
        ) : (
          <InfiniteScroll
            dataLength={searchResult?.result.length ?? 10}
            next={loadMore}
            hasMore={!!searchResult?.hasNext}
            loader={<SearchCardLoading />}
            style={{
              overflow: 'unset',
            }}
          >
            {searchResult?.result.length ? (
              searchResult.result.map((post) => (
                <SearchCard key={post.id} {...post} />
              ))
            ) : (
              <div className="text-xl text-gray-500">Nothing here.</div>
            )}
          </InfiniteScroll>
        )}
      </div>
    </>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Search;
