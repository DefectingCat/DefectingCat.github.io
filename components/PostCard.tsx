import Link from 'next/link';
import { FC } from 'react';
import { Post } from 'types';
import cn from 'classnames';

interface Props {
  post: Post;
}

const PostCard: FC<Props> = ({ post }) => {
  return (
    <>
      <Link href={`/p/${post.slug}`} passHref>
        <a>
          <article
            className={cn(
              'rounded-xl py-4 px-5 md:p-7',
              'hover:bg-sky-100 hover:bg-opacity-50',
              // 'hover:bg-rua-gray-100 hover:bg-opacity-10',
              'dark:hover:bg-rua-gray-800 dark:hover:bg-opacity-100',
              'flex items-center justify-between text-gray-800 ',
              'mb-4 dark:text-gray-200'
            )}
          >
            <div className="flex-1">
              <h2 className="mb-4 text-3xl font-semibold font-Barlow">
                {post.title}
              </h2>

              <div className="flex items-center text-sm">
                {post.tags.map((tag) => (
                  <div key={tag} className="mr-4 last:mr-0">
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            <div>{post.date}</div>
          </article>
        </a>
      </Link>
    </>
  );
};

export default PostCard;
