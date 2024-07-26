'use client';

import { Canvas } from '@react-three/fiber';
import clsx from 'clsx';
import Loading from 'components/rua/loading/rua-loading';
import { Suspense, lazy } from 'react';
import useStore from 'store';

const CloudModel = lazy(() => import('components/models/cloud-model'));

const AboutModel = () => {
  const modelLoading = useStore((state) => state.modelLoading);

  return (
    <>
      <div className={clsx('fixed top-0 left-0 -z-10', 'w-full h-full')}>
        <Canvas camera={{ position: [0, 1.8, 10] }}>
          <ambientLight color={0xffffff} intensity={0.6} />
          <Suspense fallback={<></>}>
            <CloudModel />
          </Suspense>
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
        {/* <Leva /> */}
      </div>
    </>
  );
};

export default AboutModel;
