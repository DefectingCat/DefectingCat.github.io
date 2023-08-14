'use client';

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import useStore from 'store';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Loading from 'components/rua/loading/rua-loading';
import clsx from 'clsx';
import { getMousePosition } from 'lib/utils';

const rotationY = 0.4;
const rotationX = 0.18;

const Model = () => {
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const toggleLoading = useStore((state) => state.toggleLoading);

  const camera = useThree((state) => state.camera);
  const gltf = useLoader(
    GLTFLoader,
    './models/just_a_hungry_cat/modelDraco.gltf',
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./libs/draco/');
      loader.setDRACOLoader(dracoLoader);
    },
  );
  useEffect(() => {
    // After model loaded.
    mixer.current = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      mixer.current?.clipAction(clip).play();
    });
    camera.position.x = -5.66648088408735e-8;
    camera.position.y = 0.3;
    camera.position.z = 1.3;
    toggleLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const halfWidth = Math.floor(window.innerWidth / 2);
    const halfHeight = Math.floor(window.innerHeight / 2);

    const moveHandler = (e: MouseEvent | globalThis.TouchEvent) => {
      const { x, y } = getMousePosition(e);
      // > 0 is right, < 0 is left
      // if (directionX > 0) root.rotation.y += 0.01;
      gltf.scene.rotation.x = rotationX * ((y - halfHeight) / halfHeight);
      gltf.scene.rotation.y = rotationY * ((x - halfWidth) / halfWidth);
    };
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('touchmove', moveHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('touchmove', moveHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <>
      <spotLight
        color={0xffffff}
        intensity={0.6}
        distance={100}
        angle={15}
        target={gltf.scene}
        position={[0, 2, 6]}
      />
      <primitive object={gltf.scene} />
    </>
  );
};

const HomeModel = () => {
  const modelLoading = useStore((state) => state.modelLoading);

  return (
    <>
      <Canvas camera={{ fov: 55 }}>
        <ambientLight color={0xffffff} intensity={0.5} />
        <Model />
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
