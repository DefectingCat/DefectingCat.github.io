import useGetColors from 'lib/hooks/useGetColors';
import { FC } from 'react';
import { Flex, Fade } from '@chakra-ui/react';
import UseAnimations from 'react-useanimations';
import arrowUp from 'react-useanimations/lib/arrowUp';

interface Props {
  showBacktop: boolean;
  backToTop: () => void;
}

const BackToTop: FC<Props> = ({ showBacktop, backToTop }) => {
  const { boxBg } = useGetColors();

  return (
    <>
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

export default BackToTop;
