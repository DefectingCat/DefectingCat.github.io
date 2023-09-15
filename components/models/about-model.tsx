'use client';

import { Canvas } from '@react-three/fiber';
import clsx from 'clsx';
import { Suspense, lazy } from 'react';

const CloudModel = lazy(() => import('components/models/cloud-model'));

const AboutModel = () => {
  return (
    <>
      <div className={clsx('fixed top-0 left-0 -z-10', 'w-full h-full')}>
        <Canvas camera={{ position: [0, 1.8, 10] }}>
          <ambientLight color={0xffffff} intensity={0.6} />
          <Suspense fallback={<></>}>
            <CloudModel />
          </Suspense>
        </Canvas>
        {/* <Leva /> */}
      </div>
    </>
  );
};

export default AboutModel;
