import { Html, useProgress } from '@react-three/drei';
import clsx from 'clsx';
import RUALoading from 'components/rua/loading/rua-loading';

const Loading = () => {
  const { progress } = useProgress();
  console.log(progress);

  return (
    <Html as="div">
      <div
        className={clsx(
          'h-full w-full absolute',
          'top-0 left-0 flex',
          'justify-center items-center',
          'bg-bluish-gray dark:bg-rua-gray-900',
          'transition-all duration-300',
        )}
      >
        <RUALoading />
      </div>
    </Html>
  );
};

export default Loading;
