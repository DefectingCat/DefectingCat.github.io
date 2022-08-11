import { Sandpack, SandpackProps } from '@codesandbox/sandpack-react';
import { useTheme } from 'next-themes';

interface Props extends SandpackProps {}

const RUASandpack = ({ ...rest }: Props) => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <>
      <div className="my-2 min-h-[402px]">
        <Sandpack
          {...rest}
          theme={currentTheme === 'dark' ? 'dark' : 'light'}
        />
      </div>
    </>
  );
};

export default RUASandpack;
