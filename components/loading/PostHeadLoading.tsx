import { Box, Skeleton, Tag } from '@chakra-ui/react';
import { FC } from 'react';

const PostHeadLoading: FC = () => {
  return (
    <>
      <Box as="header">
        <Box mb="1rem">
          <Skeleton height="2.7rem" />
        </Box>

        <Box mb="1rem">
          <Tag mr="0.5rem" w="4rem">
            <Skeleton height="1.5rem" />
          </Tag>
          <Tag mr="0.5rem" w="4rem">
            <Skeleton height="1.5rem" />
          </Tag>
        </Box>

        <Box>
          <Skeleton height="1rem" w="6rem" />
        </Box>
      </Box>
    </>
  );
};

export default PostHeadLoading;
