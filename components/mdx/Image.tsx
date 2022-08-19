import classNames from 'classnames';
import NextImage, { ImageProps } from 'next/future/image';

interface Props extends ImageProps {}

const Image = ({ alt, ...rest }: Props) => {
  return (
    <>
      <NextImage className="mx-auto" alt={alt} {...rest} />
      {alt && (
        <span
          className={classNames(
            'block mx-auto',
            'text-center text-gray-400',
            'my-2'
          )}
        >
          {alt}
        </span>
      )}
    </>
  );
};

export default Image;
