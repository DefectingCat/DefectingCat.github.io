'use client';

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import useMainStore from 'store';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Loading from 'components/rua/loading/rua-loading';
import clsx from 'clsx';

const Model = () => {
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const toggleLoading = useMainStore((state) => state.toggleLoading);

  const camera = useThree((state) => state.camera);
  const gltf = useLoader(
    GLTFLoader,
    './models/just_a_hungry_cat/modelDraco.gltf',
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./libs/draco/');
      loader.setDRACOLoader(dracoLoader);

      loader.manager.onLoad = () => {};
    }
  );
  useEffect(() => {
    // After model loaded.
    mixer.current = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      mixer.current?.clipAction(clip).play();
    });
    camera.position.x = -5.966648088408735e-8;
    camera.position.y = 0.2734955480754394;
    camera.position.z = 1.2001055939769085;
    toggleLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <>
      <primitive object={gltf.scene} />
    </>
  );
};

const HomeModel = () => {
  const modelLoading = useMainStore((state) => state.modelLoading);

  return (
    <>
      <Canvas>
        <spotLight color={0xffffff} intensity={1} distance={100} angle={15} />
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
          !modelLoading && 'opacity-0'
        )}
      >
        <Loading />
      </div>
    </>
  );
};

export default HomeModel;