import { FC } from 'react';
import { HighlightProvided } from 'react-instantsearch-core';
import { connectHighlight } from 'react-instantsearch-dom';
import type { PostHits } from './CustomHits';

type Props = {
  attribute: string;
  hit: PostHits;
};

const Highlight: FC<HighlightProvided & Props> = ({
  highlight,
  attribute,
  hit,
}) => {
  const parsedHit = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit,
  });

  return (
    <>
      <span>
        {parsedHit.map((part, index) =>
          part.isHighlighted ? (
            <mark key={index}>{part.value}</mark>
          ) : (
            <span key={index}>{part.value}</span>
          )
        )}
      </span>
    </>
  );
};

const CustomHighlight = connectHighlight(Highlight as any);

export default CustomHighlight;
