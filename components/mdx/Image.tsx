import clsx from 'clsx';
import NextImage, { ImageProps } from 'next/image';
import { memo } from 'react';

interface Props extends ImageProps {}

const Image = ({ alt, ...rest }: Props) => {
  return (
    <>
      <NextImage className="mx-auto" alt={alt} {...rest} />
      {alt && (
        <span
          className={clsx('block mx-auto', 'text-center text-gray-400', 'my-2')}
        >
          {alt}
        </span>
      )}
    </>
  );
};

export default memo(Image);
