import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { getMousePosition } from 'lib/utils';
import { useEffect, useRef } from 'react';
import useStore from 'store';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { rotationX, rotationY } from './home-model';

const CatModel = () => {
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
    camera.position.z = 1.5;
    toggleLoading(false);

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

  // const spotRef = useRef<THREE.SpotLight>(null);
  // useHelper(spotRef as any, THREE.SpotLightHelper, 'red');

  const objectRef = useRef<THREE.Object3D>(null);

  return (
    <>
      {/* spot light target */}
      <object3D position={[0, 0.5, -0.5]} ref={objectRef} />
      <spotLight
        color={0xffffff}
        intensity={5}
        // distance={1000}
        angle={15}
        target={objectRef.current ?? undefined}
        position={[0, 0.5, 1.5]}
      />
      <primitive object={gltf.scene} />
      {/* <OrbitControls camera={camera} /> */}
    </>
  );
};

export default CatModel;
