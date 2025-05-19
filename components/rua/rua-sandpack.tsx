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
      <div className="my-2 rounded-lg-[0.5em] overflow-hidden">
        <Sandpack
          {...rest}
          options={{
            showConsole: true,
            showConsoleButton: true,
            editorHeight: '512px',
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="my-2 rounded-lg-[0.5em] overflow-hidden">
        <Sandpack
          {...rest}
          theme={
            THEME_CATPUCCIN_MAP[
              (theme ?? 'latte') as keyof typeof THEME_CATPUCCIN_MAP
            ]
          }
          options={{
            showConsole: true,
            showConsoleButton: true,
            editorHeight: '512px',
            showRefreshButton: true,
          }}
        />
      </div>
    </>
  );
};

export default memo(RUASandpack);
