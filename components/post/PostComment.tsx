import { FC } from 'react';
import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import useInView from 'lib/hooks/useInView';

const PostComment: FC = () => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const { ref, inView } = useInView();

  return (
    <>
      <div className="my-4"></div>

      <div className="mt-4" ref={ref}>
        {inView && (
          <Giscus
            repo="DefectingCat/DefectingCat.github.io"
            repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? ''}
            categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ''}
            category="Announcements"
            mapping="title"
            reactionsEnabled="1"
            emitMetadata="0"
            theme={currentTheme === 'dark' ? 'dark_dimmed' : 'light'}
          />
        )}
      </div>
    </>
  );
};

export default PostComment;
