/**
 * Samll target item in home page
 */
import * as THREE from 'three';
import React, { JSX, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { DRACOLoader, GLTF, GLTFLoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useMediaQuery } from 'react-responsive';

type GLTFResult = GLTF & {
  nodes: {
    Cylinder016: THREE.Mesh;
    Cylinder016_1: THREE.Mesh;
    Cylinder016_2: THREE.Mesh;
  };
  materials: {
    ['Red.025']: THREE.MeshStandardMaterial;
    ['White.025']: THREE.MeshStandardMaterial;
    ['BrownDark.018']: THREE.MeshStandardMaterial;
  };
};

export function Target(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useLoader(
    GLTFLoader,
    '/models/target-processed.gltf',
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/libs/draco/');
      loader.setDRACOLoader(dracoLoader);
    },
  ) as unknown as GLTFResult;

  // animation
  const targetRef = useRef<THREE.Group>(null);
  useGSAP(() => {
    if (!targetRef.current) return;
    gsap.to(targetRef.current.position, {
      y: targetRef.current.position.y + 0.5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
    });
  });

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const position = useMemo<[number, number, number]>(() => {
    if (isMobile) {
      return [-5, -5, 3] as const;
    }
    return [-12, -10, 0] as const;
  }, [isMobile]);

  return (
    <group {...props} dispose={null}>
      <group
        rotation={[Math.PI / 2, 0, -Math.PI / 8]}
        position={position}
        ref={targetRef}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder016.geometry}
          material={materials['Red.025']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder016_1.geometry}
          material={materials['White.025']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder016_2.geometry}
          material={materials['BrownDark.018']}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/models/target-processed.gltf');

export default Target;
