import Link from 'next/link';
import { FC } from 'react';
import cn from 'classnames';
import { AllPostsWithDescription } from 'lib/readPosts';
import dynamic from 'next/dynamic';
import { FiCalendar, FiTag } from 'react-icons/fi';

const DateFormater = dynamic(() => import('components/DateFormater'));
const PostCardImage = dynamic(
  () => import('components/post-card/PostCardImage')
);

const PostCard: FC<AllPostsWithDescription> = ({
  index_img,
  url,
  title,
  desc,
  date,
  tags,
}) => {
  return (
    <>
      <div
        className={cn(
          'rounded-xl overflow-hidden bg-white',
          'mb-8 last:mb-0 transition-shadow duration-500',
          'md:hover:shadow-lg'
        )}
      >
        <PostCardImage index_img={index_img} url={url} />

        <div className={cn('p-6')}>
          {/* Title */}
          <Link href={`p/${url}`} passHref>
            <a className="md:hover:underline">
              <h1 className="text-xl font-semibold">{title}</h1>
            </a>
          </Link>

          {/* Description */}
          <p className="text-gray-600 py-3">{desc}</p>

          {/* Date and tags */}
          <div className="text-[13px] text-gray-500 flex items-center">
            <div className="flex items-center mr-4">
              <FiCalendar className="mr-2" />
              <DateFormater dateString={date} />
            </div>

            <div className="flex items-center">
              {Array.isArray(tags) ? (
                tags.map((tag) => (
                  <div key={tag} className="flex items-center">
                    <FiTag className="mr-2" />
                    {tag}
                  </div>
                ))
              ) : (
                <div className="flex items-center">
                  <FiTag className="mr-2" />
                  {tags}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
