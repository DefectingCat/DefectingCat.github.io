'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Environment, OrbitControls, useProgress } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

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

  const [loading, setLoading] = useState(true);
  useProgress((state) => {
    if (state.progress >= 100) {
      mixer.current = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        mixer.current?.clipAction(clip).play();
      });
      setLoading(false);
    }

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
      <spotLight color={0xffffff} intensity={2} distance={100} angle={15} />
      <ambientLight color={0xffffff} intensity={1} />
      <Model />
      {/*
      <OrbitControls />
      <Environment preset="sunset" background />
          */}
    </Canvas>
  );
};

export default HomeModel;