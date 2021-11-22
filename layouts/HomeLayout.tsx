import { FC, UIEventHandler, useRef, useState } from 'react';
import NavBar from '../components/NavBar';
import { Box, Flex, Fade } from '@chakra-ui/react';
import Footer from '../components/Footer';
import UseAnimations from 'react-useanimations';
import arrowUp from 'react-useanimations/lib/arrowUp';
import useGetColors from '../lib/hooks/useGetColors';

const HomeLayout: FC = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { boxBg } = useGetColors();

  const [showBacktop, setShowBacktop] = useState(false);
  const scrollListener: UIEventHandler<HTMLDivElement> = (e) => {
    const distance = (e.target as HTMLDivElement).scrollTop;
    distance > 425 ? setShowBacktop(true) : setShowBacktop(false);
  };
  const backToTop = () => {
    wrapperRef.current?.scrollTo({ top: 0 });
  };

  return (
    <>
      <Flex
        justify={'center'}
        overflow="auto"
        h={['unset', 'unset', '100vh']}
        px={['1rem', '1rem', '3rem']}
        flexFlow={['column', 'column', 'row']}
        ref={wrapperRef}
        onScroll={scrollListener}
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

      <Fade in={showBacktop}>
        <Flex
          bg={boxBg}
          w="40px"
          h="40px"
          justify="center"
          alignItems="center"
          rounded="full"
          shadow="card"
          position="fixed"
          bottom="50px"
          right="100px"
          onClick={backToTop}
          cursor="pointer"
        >
          <UseAnimations size={32} animation={arrowUp} />
        </Flex>
      </Fade>
    </>
  );
};

export default HomeLayout;
