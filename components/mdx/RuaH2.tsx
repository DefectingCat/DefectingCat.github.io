import { FC } from 'react';
import { Heading } from '@chakra-ui/react';

const RuaH2: FC = ({ children }) => {
  return (
    <>
      <Heading my="0.5rem" fontSize="1.6rem" lineHeight="2rem" margin="1rem 0">
        {children}
      </Heading>
    </>
  );
};

export default RuaH2;
