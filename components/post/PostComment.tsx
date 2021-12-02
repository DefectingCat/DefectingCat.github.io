import { FC } from 'react';
import { Giscus } from '@giscus/react';
import { Box } from '@chakra-ui/react';
import useGetColors from 'lib/hooks/useGetColors';

const PostComment: FC = () => {
  const { giscusColor } = useGetColors();

  return (
    <>
      <Box mt="2rem">
        <Giscus
          repo="DefectingCat/DefectingCat.github.io"
          repoId="MDEwOlJlcG9zaXRvcnkyMzk5MTUyNzk="
          category="Announcements"
          categoryId="DIC_kwDODkzRD84B_43T"
          mapping="title"
          reactionsEnabled="1"
          emitMetadata="0"
          theme={giscusColor}
        />
      </Box>
    </>
  );
};

export default PostComment;
