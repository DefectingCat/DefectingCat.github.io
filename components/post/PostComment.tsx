import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import useInView from 'lib/hooks/useInView';
import Image from 'next/image';

const PostComment = () => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const { ref, inView } = useInView();

  return (
    <>
      <div className="text-center select-none">
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

      <div className="mt-4" ref={ref}>
        {inView && (
          <Giscus
            repo="DefectingCat/DefectingCat.github.io"
            repoId="MDEwOlJlcG9zaXRvcnkyMzk5MTUyNzk="
            categoryId="DIC_kwDODkzRD84B_43T"
            category="Announcements"
            mapping="pathname"
            reactionsEnabled="1"
            emitMetadata="0"
            theme={currentTheme === 'dark' ? 'dark_dimmed' : 'light'}
            loading="lazy"
            inputPosition="top"
          />
        )}
      </div>
    </>
  );
};

export default PostComment;
