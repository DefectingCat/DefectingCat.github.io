import { FC } from 'react';
import { Box, Skeleton } from '@chakra-ui/react';

const PostLoadingTOC: FC = () => {
  return (
    <>
      <Box
        display={['none', 'none', 'none', 'block']}
        position="sticky"
        top="3rem"
        mt="3rem"
        w="280px"
      >
        <Skeleton height="2rem" my="1rem" />
        <Skeleton height="1rem" w="80%" mb="1rem" />
        <Skeleton height="1rem" w="80%" ml="1rem" mb="1rem" />
        <Skeleton height="1rem" w="80%" ml="1rem" mb="1rem" />
        <Skeleton height="1rem" w="80%" mb="1rem" />
        <Skeleton height="1rem" w="80%" ml="1rem" mb="1rem" />
        <Skeleton height="1rem" w="80%" ml="1rem" mb="1rem" />
      </Box>
    </>
  );
};

export default PostLoadingTOC;
