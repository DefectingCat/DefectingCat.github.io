import { FC } from 'react';
import cn from 'classnames';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Link = dynamic(() => import('components/PathLink'));

interface Props {
  index_img: string | null;
  url: string;
}

const PostCardImage: FC<Props> = ({ index_img, url }) => {
  return (
    <>
      {index_img && (
        <Link
          href={`/p/${url}`}
          className={cn('relative h-60 block', 'lg:h-72')}
        >
          <Image
            src={index_img}
            layout="fill"
            objectFit="cover"
            alt="Post Image"
            // loading="lazy"
            priority
          />
        </Link>
      )}
    </>
  );
};

export default PostCardImage;
