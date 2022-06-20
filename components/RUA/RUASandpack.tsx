import { Sandpack, SandpackProps } from '@codesandbox/sandpack-react';
import { useTheme } from 'next-themes';
import useInView from 'lib/hooks/useInView';

interface Props extends SandpackProps {}

const RUASandpack = ({ ...rest }: Props) => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const { ref, inView } = useInView();

  return (
    <>
      <div className="my-2 min-h-[402px]" ref={ref}>
        {inView && (
          <Sandpack
            {...rest}
            theme={currentTheme === 'dark' ? 'dark' : 'light'}
          />
        )}
      </div>
    </>
  );
};

export default RUASandpack;
