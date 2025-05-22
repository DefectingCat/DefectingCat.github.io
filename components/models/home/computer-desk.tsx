'use client';

import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera';
import { Canvas } from '@react-three/fiber';
import { Suspense, lazy, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import Loading from './loading';

const DeskCamera = lazy(() => import('components/models/home/desk-camera'));
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
          <DeskCamera>
            <ComputerModel
              scale={scale}
              position={[0.6, -7.2, 0]}
              rotation={[0, -Math.PI, 0]}
            />
          </DeskCamera>
          <Target />
          <ReactLogo />
          <Bocchi />
          <PerspectiveCamera makeDefault position={[0, 0, 36]} />
        </Suspense>
      </Canvas>
      {/* <Leva /> */}
    </>
  );
};

export default ComputerDesk;
