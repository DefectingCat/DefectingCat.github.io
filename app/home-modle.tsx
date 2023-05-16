'use client';

import { useProgress } from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { frameArea } from 'lib/utils';
import { useRef } from 'react';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Model = () => {
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const gltf = useLoader(
    GLTFLoader,
    './models/just_a_hungry_cat/modelDraco.gltf',
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./libs/draco/');
      loader.setDRACOLoader(dracoLoader);
    }
  );

  const camera = useThree((state) => state.camera);
  const process = useProgress((state) => {
    if (state.progress < 100) return state.progress;

    // After model loaded.
    mixer.current = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      mixer.current?.clipAction(clip).play();
    });

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const boxSize = box.getSize(new THREE.Vector3()).length();
    const boxCenter = box.getCenter(new THREE.Vector3());
    frameArea(
      boxSize * 0.8,
      boxSize,
      boxCenter,
      camera as THREE.PerspectiveCamera
    );
    camera.position.z += 0.15;
    camera.position.y -= 0.15;
    return state.progress;
  });

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
  return (
    <Canvas>
      <spotLight color={0xffffff} intensity={1.5} distance={100} angle={15} />
      <ambientLight color={0xffffff} intensity={0.5} />
      <Model />
    </Canvas>
  );
};

export default HomeModel;