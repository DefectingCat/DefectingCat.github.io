import { Box } from '@chakra-ui/react';
import { FC } from 'react';

const PostTOC: FC = ({ children }) => {
  return (
    <>
      <Box
        display={['none', 'none', 'none', 'block']}
        position="sticky"
        top="3rem"
        mt="3rem"
      >
        {children}
      </Box>
    </>
  );
};

export default PostTOC;
