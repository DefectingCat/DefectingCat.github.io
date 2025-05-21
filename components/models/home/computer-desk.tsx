'use client';

import { Canvas } from '@react-three/fiber';
import { lazy, Suspense, useMemo } from 'react';
import Loading from './loading';
import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera';
import { useMediaQuery } from 'react-responsive';
import { useTexture } from '@react-three/drei';

const ComputerModel = lazy(
  () => import('components/models/home/computer-model'),
);
const Target = lazy(() => import('components/models/home/target'));
const ReactLogo = lazy(() => import('components/models/home/react-logo'));
const Bocchi = lazy(() => import('components/models/home/bocchi'));

const ComputerDesk = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const scale = useMemo(() => {
    if (isMobile) {
      return 0.08;
    }
    return 0.1;
  }, [isMobile]);

  return (
    <>
      <Canvas>
        <Suspense fallback={<Loading />}>
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 10]} intensity={0.5} />
          <ComputerModel
            scale={scale}
            position={[0.6, -7.2, 0]}
            rotation={[0, -Math.PI, 0]}
          />
          <Target />
          <ReactLogo />
          <PerspectiveCamera makeDefault position={[0, 0, 30]} />
          <Bocchi />
        </Suspense>
      </Canvas>
      {/* <Leva /> */}
    </>
  );
};

export default ComputerDesk;
