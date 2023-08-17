'use client';

import { Canvas } from '@react-three/fiber';
import clsx from 'clsx';
import Loading from 'components/rua/loading/rua-loading';
import { Suspense, lazy } from 'react';
import useStore from 'store';

const CatModel = lazy(() => import('components/models/cat-model'));

export const rotationY = 0.4;
export const rotationX = 0.18;

const HomeModel = () => {
  const modelLoading = useStore((state) => state.modelLoading);

  return (
    <>
      <Canvas camera={{ fov: 55 }}>
        <ambientLight color={0xffffff} intensity={0.6} />
        <Suspense fallback={<></>}>
          <CatModel />
        </Suspense>
        {/* <Stats /> */}
      </Canvas>
      <div
        className={clsx(
          'h-full w-full absolute',
          'top-0 left-0 flex',
          'justify-center items-center',
          'bg-bluish-gray dark:bg-rua-gray-900',
          'transition-all duration-300',
          !modelLoading && 'opacity-0',
        )}
      >
        <Loading />
      </div>
    </>
  );
};

export default HomeModel;
