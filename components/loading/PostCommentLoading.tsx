import { Box, Flex, Skeleton, SkeletonCircle, Divider } from '@chakra-ui/react';
import { FC } from 'react';

const PostCommentLoading: FC = () => {
  return (
    <>
      <Box h={['346px', '350px']} overflow="hidden">
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
          <Divider my="0.5rem" />

          <Box h="208px">
            <Skeleton h="45px" />
            <Skeleton h="full" mt="0.5rem" />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PostCommentLoading;
