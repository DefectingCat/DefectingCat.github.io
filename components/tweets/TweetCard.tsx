import { FC } from 'react';
import type { TweetsWithUser } from 'pages/tweets';
import cn from 'classnames';
import useUnified from 'lib/hooks/useUnified';
import dynamic from 'next/dynamic';

const Date = dynamic(() => import('components/DateFormater'));

interface Props {
  tweet: TweetsWithUser;
}

const TweetCard: FC<Props> = ({ tweet }) => {
  const postContent = useUnified(tweet.content);

  return (
    <>
      <div
        className={cn(
          'bg-white dark:bg-rua-gray-800',
          'md:hover:shadow-lg rounded-xl',
          'p-6 transition-all duration-500',
          'md:w-4/5 mx-auto lg:w-3/4'
        )}
      >
        <h1 className="pb-2 text-gray-500">
          @{tweet.Users.username}ㆍ
          <Date dateString={tweet.createAt} />
        </h1>
        <div>{postContent}</div>
      </div>
    </>
  );
};

export default TweetCard;
