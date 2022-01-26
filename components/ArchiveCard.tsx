import { FC } from 'react';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import { AllPostsWithMatter } from 'lib/posts';

const DateFormater = dynamic(() => import('components/DateFormater'));
const Link = dynamic(() => import('components/PathLink'));

interface Props {
  post: AllPostsWithMatter;
}

const ArchiveCard: FC<Props> = ({ post }) => {
  const { id, title, url, date } = post;

  return (
    <>
      <Link
        href={`p/${url}`}
        className={cn(
          'block',
          'bg-underline bg-bottom bg-no-repeat bg-[length:95%_1px]',
          'duration-300 transition-all',
          'last:bg-none',
          'hover:bg-[length:100%_1px]'
        )}
      >
        <div className={cn('p-5')}>
          <h2 className="font-semibold text-lg mb-2">{title}</h2>
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
