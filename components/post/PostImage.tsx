import React, { FC } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import useLazyLoad from 'lib/hooks/useLazyload';
import useMediaQuery from 'lib/hooks/useMediaQuery';
import cn from 'classnames';

interface Props {
  src: string;
}

const PostImage: FC<Props> = ({ src }) => {
  const { initSrc, blur, targetRef } = useLazyLoad(src);
  const isLargerThan640 = useMediaQuery('(min-width: 640px)');

  return (
    <>
      <Zoom wrapElement="picture" zoomMargin={isLargerThan640 ? 300 : 0}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={targetRef}
          className={cn('rounded-md duration-300 object-cover', {
            blur: blur,
          })}
          src={initSrc}
          alt="Post image"
        />
      </Zoom>
    </>
  );
};

export default PostImage;
