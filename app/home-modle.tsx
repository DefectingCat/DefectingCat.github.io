'use client';

import { Canvas } from '@react-three/fiber';

const HomeModle = () => {
  return (
    <Canvas>
      <spotLight color={0xffffff} intensity={2} distance={100} angle={15} />
      <ambientLight color={0xffffff} intensity={1} />
    </Canvas>
  );
};

export default HomeModle;