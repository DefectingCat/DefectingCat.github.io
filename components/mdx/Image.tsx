import NextImage, { ImageProps } from 'next/image';

interface Props extends ImageProps {}

const Image = ({ alt, ...rest }: Props) => {
  return (
    <>
      <span className="block text-center">
        <NextImage alt={alt} placeholder="blur" {...rest} />
        {alt && <span className="block text-center text-gray-400">{alt}</span>}
      </span>
    </>
  );
};

export default Image;
