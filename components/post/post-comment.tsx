'use client';

import Giscus from '@giscus/react';
import { THEME_CATPUCCIN_MAP } from 'lib/consts';
import useRuaTheme from 'lib/hooks/use-rua-theme';
import { memo } from 'react';

const PostComment = () => {
  const { theme } = useRuaTheme();

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
        theme={
          THEME_CATPUCCIN_MAP[
            (theme ?? 'latte') as keyof typeof THEME_CATPUCCIN_MAP
          ] === 'dark'
            ? 'noborder_gray'
            : 'noborder_light'
        }
        loading="lazy"
        inputPosition="top"
      />
    </>
  );
};

export default memo(PostComment);
