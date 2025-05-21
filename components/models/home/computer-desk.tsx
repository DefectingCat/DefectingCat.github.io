'use client';

import { Canvas } from '@react-three/fiber';
import { lazy, Suspense } from 'react';
import Loading from './loading';
import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera';
import { Leva, useControls } from 'leva';

const ComputerModel = lazy(
  () => import('components/models/home/computer-model'),
);

const ComputerDesk = () => {
  const c = useControls('RUARoom', {
    positionX: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.1,
    },
    positionY: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.1,
    },
    positionZ: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01,
    },
    rotationX: {
      value: 0,
      min: -Math.PI,
      max: Math.PI,
      step: 0.01,
    },
    rotationY: {
      value: 0,
      min: -Math.PI,
      max: Math.PI,
      step: 0.01,
    },
    rotationZ: {
      value: 0,
      min: -Math.PI,
      max: Math.PI,
      step: 0.001,
    },
    scale: {
      value: 1,
      min: 0.1,
      max: 10,
      step: 0.01,
    },
  });

  return (
    <>
      <Canvas>
        <Suspense fallback={<Loading />}>
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 10]} intensity={0.5} />
          <ComputerModel
            scale={0.1}
            position={[0.6, -6.0, 0]}
            rotation={[0, -Math.PI, 0]}
          />
          <PerspectiveCamera makeDefault position={[0, 0, 30]} />
        </Suspense>
      </Canvas>
      <Leva />
    </>
  );
};

export default ComputerDesk;
