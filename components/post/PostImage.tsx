import { FC, useEffect, useRef, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import { Image } from '@chakra-ui/react';
import placeholder from '../../public/images/img/placeholder-600x500.webp';

interface Props {
  isLargerThan768: boolean;
  src: string;
}

const PostImage: FC<Props> = ({ isLargerThan768, src }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [blur, setBlur] = useState('blur(20px)');

  const cleanBlur = () => {
    setBlur('unset');
  };

  useEffect(() => {
    // Lazy load images when they entry the view port.
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (imgRef.current) {
            imgRef.current.src = src;
            observer.unobserve(imgRef.current);
            imgRef.current.addEventListener('load', cleanBlur);
          }
        }
      });
    });

    imgRef.current && observer.observe(imgRef.current);

    const cleanRef = imgRef.current;
    // Clean up the images event listener.
    return () => {
      cleanRef && cleanRef.removeEventListener('load', cleanBlur);
    };
  }, [src]);

  return (
    <>
      <Zoom
        wrapElement="a"
        wrapStyle={{ width: '100%' }}
        zoomMargin={isLargerThan768 ? 300 : 0}
      >
        <Image
          ref={imgRef}
          borderRadius="10px"
          src={placeholder.blurDataURL}
          w="100%"
          filter={blur}
          transitionDuration="slower"
          alt="Post image"
        />
      </Zoom>
    </>
  );
};

export default PostImage;
