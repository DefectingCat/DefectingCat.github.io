'use client';

import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Environment, OrbitControls } from '@react-three/drei';

const Model = () => {
  const gltf = useLoader(
    GLTFLoader,
    './models/just_a_hungry_cat/modelDraco.gltf',
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./libs/draco/');
      loader.setDRACOLoader(dracoLoader);
    }
  );

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