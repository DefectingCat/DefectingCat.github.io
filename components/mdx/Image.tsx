import NextImage from 'next/image';
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

interface Props
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {}

const Image = ({ src, alt }: Props) => {
  return (
    <>
      <NextImage
        src={src ?? ''}
        alt={alt}
        layout="responsive"
        width="100%"
        height="100%"
      />
      <span className="block text-center text-gray-400">{alt}</span>
    </>
  );
};

export default Image;
