import { useTheme } from 'next-themes';
import Image from 'next/image';
import { memo } from 'react';

const PostCommnetLine = () => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <>
      <div className="flex justify-center select-none">
        {currentTheme === 'dark' ? (
          <Image
            src="/images/img/comment-line-dark.svg"
            width={300}
            height={150}
            alt=""
          />
        ) : (
          <Image
            src="/images/img/comment-line.svg"
            width={300}
            height={150}
            alt=""
          />
        )}
      </div>
    </>
  );
};

export default memo(PostCommnetLine);
