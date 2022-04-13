import NextImage from 'next/image';
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import styles from './Image.module.css';

interface Props
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {}

const Image = ({ src, alt }: Props) => {
  return (
    <>
      <p className={styles.imageContainer}>
        <NextImage
          src={src ?? ''}
          alt={alt}
          layout="fill"
          className={styles.image}
        />
        <span className="block text-center text-gray-400">{alt}</span>
      </p>
    </>
  );
};

export default Image;
