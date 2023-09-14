import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { getMousePosition } from 'lib/utils';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { rotationX, rotationY } from './home-model';

const CloudModel = () => {
  const mixer = useRef<THREE.AnimationMixer | null>(null);

  const camera = useThree((state) => state.camera);
  const gltf = useLoader(
    GLTFLoader,
    './models/cloud_station/modelDraco.gltf',
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./libs/draco/');
      loader.setDRACOLoader(dracoLoader);
    },
  );
  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      mixer.current?.clipAction(clip).play();
    });

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
      <primitive object={gltf.scene} />
    </>
  );
};

export default CloudModel;
