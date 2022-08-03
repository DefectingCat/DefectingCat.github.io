import NextImage, { ImageProps } from 'next/image';

interface Props extends ImageProps {}

const Image = ({ alt, ...rest }: Props) => {
  const supportImg = ['jpeg', 'png', 'webp', 'avif'];
  const placeholder = supportImg.includes((rest.src as { src: string }).src)
    ? 'blur'
    : 'empty';

  return (
    <>
      <span className="block text-center">
        <NextImage alt={alt} placeholder={placeholder} {...rest} />
        {alt && <span className="block text-center text-gray-400">{alt}</span>}
      </span>
    </>
  );
};

export default Image;
