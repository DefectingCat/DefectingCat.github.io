import { FC } from 'react';
import cn from 'classnames';
import { Post } from 'pages/index';
import dynamic from 'next/dynamic';
import { FiCalendar } from 'react-icons/fi';

const DateFormater = dynamic(() => import('components/DateFormater'));
const PostCardTags = dynamic(() => import('components/post-card/PostCardTags'));
const PostCardImage = dynamic(
  () => import('components/post-card/PostCardImage')
);
const Link = dynamic(() => import('components/PathLink'));

const PostCard: FC<Post> = ({ index_img, url, title, desc, date, tags }) => {
  return (
    <>
      <article
        className={cn(
          'rounded-xl overflow-hidden bg-white',
          'mb-8 last:mb-0 transition-shadow duration-500',
          'md:hover:shadow-lg dark:bg-rua-gray-800'
        )}
      >
        <PostCardImage index_img={index_img} url={url} />

        <div className={cn('p-6')}>
          {/* Title */}
          <Link href={`/p/${url}`} className="md:hover:underline">
            <h1 className="text-xl font-semibold">{title}</h1>
          </Link>

          {/* Description */}
          <p className="py-3 text-gray-600 dark:text-gray-400">{desc}</p>

          {/* Date and tags */}
          <div className="text-[13px] text-gray-500 dark:text-gray-400 flex items-center">
            <div className="flex items-center mr-4">
              <FiCalendar className="mr-2" />
              <DateFormater dateString={date} />
            </div>

            <div className="flex items-center">
              <PostCardTags tags={tags} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostCard;
