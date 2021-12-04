import { Box, Flex, Skeleton } from '@chakra-ui/react';
import useGetColors from 'lib/hooks/useGetColors';
import { FC } from 'react';

const ArchiveLoadingCard: FC = () => {
  const { borderColor } = useGetColors();

  return (
    <>
      <Flex
        as="article"
        borderBottom="1px"
        p="1.25rem"
        cursor="pointer"
        justifyContent="space-between"
        borderColor={borderColor}
      >
        <Flex w="full" flexFlow="column">
          <Skeleton w="80%" height="1.5rem" mb="0.5rem" />
          <Skeleton w="20%" height="1.5rem" />
        </Flex>

        <Box w="50px" h="50px" rounded="lg" overflow="hidden">
          <Skeleton height="50" />
        </Box>
      </Flex>
    </>
  );
};

export default ArchiveLoadingCard;
