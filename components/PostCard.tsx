import Link from 'next/link';
import { Post } from 'types';
import clsx from 'clsx';
import { memo } from 'react';

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  return (
    <>
      <Link href={`/p/${post.slug}`} passHref>
        <article
          className={clsx(
            'rounded-xl py-4 px-5 md:p-7 ',
            'hover:bg-sky-100 hover:bg-opacity-50',
            // 'hover:bg-rua-gray-100 hover:bg-opacity-10',
            'dark:hover:bg-rua-gray-800 dark:hover:bg-opacity-100',
            'flex justify-between text-gray-800 ',
            'mb-4 dark:text-gray-200',
            'flex-col'
          )}
        >
          <div className="flex justify-between">
            <h2 className="mb-4 text-3xl font-semibold font-Barlow">
              {post.title}
            </h2>

            <div className="hidden lg:block">{post.date}</div>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center text-sm">
              {Array.isArray(post.tags) ? (
                post.tags.map((tag) => (
                  <div key={tag} className="mr-4 last:mr-0">
                    {tag}
                  </div>
                ))
              ) : (
                <div className="mr-4 last:mr-0">{post.tags}</div>
              )}
            </div>

            <div className="lg:hidden">{post.date}</div>
          </div>
        </article>
      </Link>
    </>
  );
};

export default memo(PostCard);