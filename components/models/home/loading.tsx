import { Html } from '@react-three/drei';
import clsx from 'clsx';
import RUALoading from 'components/rua/loading/rua-loading';

const Loading = () => {
  return (
    <Html as="div">
      <div
        className={clsx(
          'h-[100vh] w-[100vw] fixed',
          'top-0 left-0 flex z-50',
          'justify-center items-center',
          'bg-bluish-gray dark:bg-rua-gray-900',
          'transition-all duration-300',
          'translate-x-[-50%] translate-y-[-50%]',
        )}
      >
        <RUALoading />
      </div>
    </Html>
  );
};

export default Loading;
