import { Box, Flex, Skeleton, SkeletonCircle, Divider } from '@chakra-ui/react';
import { FC } from 'react';

const PostCommentLoading: FC = () => {
  return (
    <>
      <Box h="350px">
        <Flex
          h="60px"
          mt="2rem"
          mb="1rem"
          alignItems="center"
          flexFlow="column"
        >
          <Skeleton h="1.5rem" w="6rem" />
          <SkeletonCircle size="1.75rem" mt="0.5rem" />
        </Flex>

        <Box h="274px">
          <Skeleton h="2rem" mb="0.5rem" w="6rem" />
          <Divider />

          <Box h="208">
            <Skeleton h="45px" />
            <Skeleton h="6rem" mt="0.5rem" />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PostCommentLoading;
