import React, { FC } from 'react';
import useLazyLoad from 'lib/hooks/useLazyload';
import useMediaQuery from 'lib/hooks/useMediaQuery';
import cn from 'classnames';

interface Props {
  src: string;
}

const PostIframe: FC<Props> = ({ src }) => {
  const { initSrc, targetRef } = useLazyLoad(src);
  const isLargerThan640 = useMediaQuery('(min-width: 640px)');

  return (
    <div
      className={cn(
        'rounded-md overflow-hidden',
        { 'aspect-video': isLargerThan640 },
        { 'aspect-square': !isLargerThan640 }
      )}
    >
      <iframe
        title={'Post iframe'}
        className={'w-full h-full'}
        ref={targetRef}
        src={initSrc}
        frameBorder="0"
      />
    </div>
  );
};

export default PostIframe;
