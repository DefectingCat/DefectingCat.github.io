import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { JSX, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import * as THREE from 'three';

const DeskCamera = ({ children }: { children: JSX.Element }) => {
  const groupRef = useRef<THREE.Group>(null);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [0, 0, 26], 0.25, delta);

    if (!isMobile && groupRef.current) {
      const x = (() => {
        const _x = state.pointer.y / 3;
        if (_x < 0) {
          if (_x <= -0.14) {
            return -0.14;
          } else {
            return _x;
          }
        } else {
          if (_x >= 0.14) {
            return 0.14;
          } else {
            return _x;
          }
        }
      })();
      easing.dampE(
        groupRef.current.rotation,
        [-x, -state.pointer.x / 5, 0],
        0.25,
        delta,
      );
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default DeskCamera;
