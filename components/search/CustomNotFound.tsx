import { FC } from 'react';
import { Flex, Text } from '@chakra-ui/react';

const CustomNotFound: FC = () => {
  return (
    <>
      <Flex mt="1rem" h="10rem" justifyContent="center" alignItems="center">
        <Text>Aw snap! No search results were found.</Text>
      </Flex>
    </>
  );
};

export default CustomNotFound;
