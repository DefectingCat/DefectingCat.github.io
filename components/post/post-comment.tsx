'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import { memo } from 'react';

const PostComment = () => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <>
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
    </>
  );
};

export default memo(PostComment);