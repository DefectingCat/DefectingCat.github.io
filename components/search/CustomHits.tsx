import { FC } from 'react';
import { HitsProvided } from 'react-instantsearch-core';
import { connectHits } from 'react-instantsearch-dom';
import dynamic from 'next/dynamic';

const HitCard = dynamic(() => import('./HitCard'));

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

const Hits: FC<HitsProvided<PostHits>> = ({ hits }) => {
  return (
    <>
      {hits.map((item) => {
        return <HitCard key={item.objectID} hit={item} />;
      })}
    </>
  );
};

const CustomHits = connectHits(Hits);

export default CustomHits;
