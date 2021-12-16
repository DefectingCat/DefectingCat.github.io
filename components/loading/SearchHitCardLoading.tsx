import { Box, Skeleton } from '@chakra-ui/react';
import useGetColors from 'lib/hooks/useGetColors';
import { FC } from 'react';

const SearchHitCardLoading: FC = () => {
  const { boxBg } = useGetColors();

  return (
    <>
      <Box as="article" bg={boxBg} mt="1rem" p="1rem">
        <Skeleton w="45%" height="1.5rem" mb="0.5rem" />

        <Box>
          <Skeleton height="1rem" mb="0.2rem" />
          <Skeleton height="1rem" mb="0.2rem" />
          <Skeleton w="20%" height="1rem" mb="0.2rem" />
        </Box>
      </Box>
    </>
  );
};

export default SearchHitCardLoading;
