import { FC, useCallback, useEffect, useState } from 'react';
import { Giscus } from '@giscus/react';
import dynamic from 'next/dynamic';
import cn from 'classnames';
import useDarkMode from '../../lib/hooks/useDarkMode';

const PostCommentLoading = dynamic(
  () => import('components/loading/PostCommentLoading')
);

const ready = /\[iFrameSizer\]\iFrameResizer.*?\:init/;

const PostComment: FC = () => {
  const [commentLoaded, setCommentLoaded] = useState(false);
  const { isDark } = useDarkMode();

  /**
   * Listen the window.parent.postMessage() from Giscus componenet.
   * When get the message, its mean Giscus component loading completed.
   */
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.origin === 'https://giscus.app' && ready.test(event.data)) {
      setCommentLoaded(true);
    }
    // if (!(typeof event.data === 'object' && event.data.giscus)) return;
    // const giscusData = event.data.giscus;
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  return (
    <>
      <div className={cn('mt-8', { hidden: !commentLoaded })}>
        <Giscus
          repo="DefectingCat/DefectingCat.github.io"
          repoId={process.env.REPO_ID ?? ''}
          categoryId={process.env.CATEGORY_ID ?? ''}
          category="Announcements"
          mapping="title"
          reactionsEnabled="1"
          emitMetadata="0"
          theme={isDark ? 'dark_dimmed' : 'light'}
        />
      </div>
      {commentLoaded || <PostCommentLoading />}
    </>
  );
};

export default PostComment;
