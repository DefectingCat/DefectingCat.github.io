import { FC } from 'react';
import { HitsProvided } from 'react-instantsearch-core';
import { connectHits } from 'react-instantsearch-dom';
import CustomHighlight from './CustomHighlight';

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
      <ol>
        {hits.map((item) => {
          return (
            <li key={item.objectID}>
              <CustomHighlight attribute="title" hit={item} />
              <CustomHighlight attribute="desc" hit={item} />
            </li>
          );
        })}
      </ol>
    </>
  );
};

const CustomHits = connectHits(Hits);

export default CustomHits;
