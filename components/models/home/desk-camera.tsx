import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { JSX, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import useStore from 'store';
import * as THREE from 'three';

const DeskCamera = ({ children }: { children: JSX.Element }) => {
  const groupRef = useRef<THREE.Group>(null);

  const navbarHoverItems = useStore((state) => state.navbarHoverItems);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  useFrame((state, delta) => {
    // enter animation
    easing.damp3(state.camera.position, [0, 0, 26], 0.25, delta);

    const hasHover = Object.values(navbarHoverItems).some((v) => v);
    if (groupRef.current && hasHover) {
      easing.dampE(groupRef.current.rotation, [0, 0, 0], 0.25, delta);
    }
    // mouse move animation
    if (!isMobile && groupRef.current && !hasHover) {
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

  // move camera to specific position when hovering navbar
  useFrame((state, delta) => {
    const map = {
      blog: () => {
        easing.damp3(state.camera.position, [0, 8.8, -10], 0.25, delta);
      },
      projects: () => {
        easing.damp3(state.camera.position, [-10, 8, -12], 0.25, delta);
        if (groupRef.current) {
          easing.dampE(groupRef.current.rotation, [0, -7.2, 0], 0.25, delta);
        }
      },
      tags: () => {
        easing.damp3(state.camera.position, [-7, 5, -14], 0.25, delta);
        if (groupRef.current) {
          easing.dampE(groupRef.current.rotation, [1, 0, 0], 0.25, delta);
        }
      },
      friends: () => {
        easing.damp3(state.camera.position, [10, 5, -12], 0.25, delta);
      },
      about: () => {
        easing.damp3(state.camera.position, [-24, 14, -10], 0.25, delta);
      },
    };

    for (const [key, value] of Object.entries(navbarHoverItems)) {
      if (value) {
        /** @ts-expect-error */
        map[key]();
      }
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default DeskCamera;
