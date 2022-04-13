import { FC, useEffect, useState } from 'react';
import { Sandpack, SandpackProps } from '@codesandbox/sandpack-react';
import '@codesandbox/sandpack-react/dist/index.css';
import { useTheme } from 'next-themes';

interface Props extends SandpackProps {}

const RUASandpack: FC<Props> = ({ ...rest }) => {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <div className="my-2">
        <Sandpack
          {...rest}
          theme={currentTheme === 'dark' ? 'dark' : 'light'}
        />
      </div>
    </>
  );
};

export default RUASandpack;
