import { FC } from 'react';
import { StateResultsProvided } from 'react-instantsearch-core';
import { connectStateResults } from 'react-instantsearch-dom';
import dynamic from 'next/dynamic';
import SearchHitCardLoading from 'components/loading/SearchHitCardLoading';

const HitCard = dynamic(() => import('./HitCard'), {
  loading: () => <SearchHitCardLoading />,
});
const CustomNotFound = dynamic(() => import('./CustomNotFound'));

export interface PostHits {
  objectID: string;
  title: string;
  id: string;
  desc: string;
  date: Date;
  tags: string | string[];
  categories: string;
  url: string;
  index_img: string;
}

const Hits: FC<StateResultsProvided<PostHits>> = ({
  searchState,
  searchResults,
}) => {
  const validQuery = searchState.query && searchState.query?.length >= 3;

  return (
    <>
      {searchResults?.hits.length === 0 && validQuery && <CustomNotFound />}
      {searchResults?.hits.length > 0 &&
        validQuery &&
        searchResults.hits.map((hit) => (
          <HitCard key={hit.objectID} hit={hit} />
        ))}
    </>
  );
};

const CustomHits = connectStateResults(Hits);

export default CustomHits;
