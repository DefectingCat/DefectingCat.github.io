import { FC } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

const ImageSpinner: FC = () => {
  return (
    <>
      <Flex h="full" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Flex>
    </>
  );
};

export default ImageSpinner;
