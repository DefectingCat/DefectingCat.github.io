import { FC, UIEventHandler, useRef, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('components/Footer'));
const NavBar = dynamic(() => import('components/NavBar'));
const BackToTop = dynamic(() => import('components/BackToTop'));

const HomeLayout: FC = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

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

        {/* Content on the right */}
        <Box mt={['1rem', null, '3rem']} flex="1" maxW="55rem" as="main">
          {children}
          <Footer />
        </Box>
      </Flex>

      {showBacktop && (
        <BackToTop showBacktop={showBacktop} backToTop={backToTop} />
      )}
    </>
  );
};

export default HomeLayout;
