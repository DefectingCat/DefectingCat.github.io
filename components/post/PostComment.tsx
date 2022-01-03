import { FC, useCallback, useEffect, useState } from 'react';
import { Giscus } from '@giscus/react';
import { Box } from '@chakra-ui/react';
import useGetColors from 'lib/hooks/useGetColors';
import dynamic from 'next/dynamic';

const PostCommentLoading = dynamic(
  () => import('components/loading/PostCommentLoading')
);

const PostComment: FC = () => {
  const { giscusColor } = useGetColors();

  const [commentLoaded, setCommentLoaded] = useState(false);

  /**
   * Listen the window.parent.postMessage() from Giscus componenet.
   * When get the message, its mean Giscus component loading completed.
   */
  const handleMessage = useCallback((event: MessageEvent) => {
    if (
      event.origin === 'https://giscus.app' &&
      event.data === '[iFrameResizerChild]Ready'
    ) {
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
      <Box mt="2rem" display={commentLoaded ? 'block' : 'none'}>
        <Giscus
          repo="DefectingCat/DefectingCat.github.io"
          repoId={process.env.REPO_ID ?? ''}
          categoryId={process.env.CATEGORY_ID ?? ''}
          category="Announcements"
          mapping="title"
          reactionsEnabled="1"
          emitMetadata="0"
          theme={giscusColor}
        />
      </Box>
      {commentLoaded || <PostCommentLoading />}
    </>
  );
};

export default PostComment;
