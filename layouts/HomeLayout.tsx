import { FC, useRef } from 'react';
import NavBar from '../components/NavBar';
import { Box, Flex } from '@chakra-ui/react';
import Footer from '../components/Footer';
import { BackTop } from 'antd';
import UseAnimations from 'react-useanimations';
import arrowUp from 'react-useanimations/lib/arrowUp';

const HomeLayout: FC = ({ children }) => {
  const wrapperRef = useRef(null);

  return (
    <>
      <Flex
        justify={'center'}
        overflow="auto"
        h={['unset', 'unset', '100vh']}
        px={['1rem', '1rem', '3rem']}
        flexFlow={['column', 'column', 'row']}
        ref={wrapperRef}
      >
        {/* Here is NavBar on the left */}
        <Flex
          as="header"
          position={'sticky'}
          top={['0', '0', '3rem']}
          w={[null, null, '120px', '11rem']}
          mr={[null, null, '3rem']}
          mt={[null, null, '3rem']}
        >
          <NavBar />
        </Flex>

        {/* Content */}
        <Box mt={['1rem', null, '3rem']} as="main">
          {children}
          <Footer />
        </Box>
      </Flex>

      <BackTop
        target={() => (wrapperRef.current ? wrapperRef.current : document.body)}
      >
        <Flex
          bg="white"
          w="40px"
          h="40px"
          justify="center"
          alignItems="center"
          rounded="full"
          shadow="card"
        >
          <UseAnimations size={32} animation={arrowUp} />
        </Flex>
      </BackTop>
    </>
  );
};

export default HomeLayout;
