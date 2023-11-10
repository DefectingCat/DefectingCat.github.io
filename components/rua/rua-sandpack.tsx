'use client';

import { Sandpack, SandpackProps } from '@codesandbox/sandpack-react';
import { THEME_CATPUCCIN_MAP } from 'lib/consts';
import useMounted from 'lib/hooks/use-mounted';
import { useTheme } from 'next-themes';
import { memo } from 'react';

interface Props extends SandpackProps {}

const RUASandpack = ({ ...rest }: Props) => {
  const { mounted } = useMounted();
  const { theme } = useTheme();

  if (!mounted) {
    return (
      <div className="my-2 min-h-[402px]">
        <Sandpack {...rest} />
      </div>
    );
  }

  return (
    <>
      <div className="my-2 min-h-[402px]">
        <Sandpack
          {...rest}
          theme={
            THEME_CATPUCCIN_MAP[
              (theme ?? 'latte') as keyof typeof THEME_CATPUCCIN_MAP
            ]
          }
        />
      </div>
    </>
  );
};

export default memo(RUASandpack);
