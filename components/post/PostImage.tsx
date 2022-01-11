import { useMediaQuery, Image } from '@chakra-ui/react';
import { FC } from 'react';
import useLazyLoad from 'lib/hooks/useLazyload';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface Props {
  src: string;
}

const PostImage: FC<Props> = ({ src }) => {
  const { initSrc, blur, targetRef } = useLazyLoad(src, '20px');
  const [isLargerThan640] = useMediaQuery('(min-width: 640px)');

  return (
    <>
      <Zoom wrapElement="picture" zoomMargin={isLargerThan640 ? 300 : 0}>
        <Image
          ref={targetRef}
          borderRadius="10px"
          src={initSrc}
          filter={blur}
          transitionDuration="slower"
          alt="Post image"
          h="100%"
          objectFit="cover"
        />
      </Zoom>
    </>
  );
};

export default PostImage;
