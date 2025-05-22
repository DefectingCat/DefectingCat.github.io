'use client';

import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera';
import { Canvas } from '@react-three/fiber';
import clsx from 'clsx';
import RuaLoading from 'components/rua/loading/rua-loading';
import { Suspense, lazy, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import useStore from 'store';

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

  const modelLoading = useStore((state) => state.modelLoading);

  return (
    <>
      <Canvas>
        <Suspense fallback={<></>}>
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

      <div
        className={clsx(
          'h-full w-full absolute',
          'top-0 left-0 flex',
          'justify-center items-center',
          // 'bg-bluish-gray dark:bg-rua-gray-900',
          'transition-all duration-300',
          !modelLoading && 'opacity-0',
        )}
      >
        <RuaLoading />
      </div>
      {/* <Leva /> */}
    </>
  );
};

export default ComputerDesk;
