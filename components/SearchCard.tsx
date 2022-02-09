import { FC } from 'react';
import dynamic from 'next/dynamic';
import { SearchType } from 'lib/API/types';
import cn from 'classnames';

const Link = dynamic(() => import('components/PathLink'));

const SearchCard: FC<SearchType['result'][0]> = ({ id, title, desc, url }) => {
  return (
    <>
      <Link href={`/p/${url}`} className="block mb-6 last:mb-0">
        <article
          className={cn(
            'rounded-xl overflow-hidden bg-white',
            'transition-shadow duration-500',
            'md:hover:shadow-lg dark:bg-rua-gray-800',
            'p-6'
          )}
        >
          {/* Title */}
          <h1 className="text-xl font-semibold">{title}</h1>

          {/* Description */}
          <p className="py-3 text-gray-600 dark:text-gray-400">{desc}</p>
        </article>
      </Link>
    </>
  );
};

export default SearchCard;
