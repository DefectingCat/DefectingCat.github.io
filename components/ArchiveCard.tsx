import { FC } from 'react';
import cn from 'classnames';
import dynamic from 'next/dynamic';

const DateFormater = dynamic(() => import('components/DateFormater'));
const Link = dynamic(() => import('components/PathLink'));

interface Props {
  post: {
    id: string;
    date: string;
    title: string;
    url: string;
  };
}

const ArchiveCard: FC<Props> = ({ post }) => {
  const { title, url, date } = post;

  return (
    <>
      <Link
        href={`/p/${url}`}
        className={cn(
          'block',
          'bg-underline bg-bottom bg-no-repeat bg-[length:95%_2px]',
          'duration-300 transition-all',
          'last:bg-none dark:bg-underline-dark dark:last:bg-none',
          'hover:bg-[length:100%_2px]'
        )}
      >
        <div className={cn('p-5')}>
          <h2 className="mb-2 text-lg font-semibold">{title}</h2>
          <DateFormater
            dateString={date}
            className="text-sm text-gray-600 dark:text-gray-400"
          />
        </div>
      </Link>
    </>
  );
};

export default ArchiveCard;
