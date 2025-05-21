import { useGLTF, Float } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { JSX, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import * as THREE from 'three';
import { DRACOLoader, GLTF, GLTFLoader } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    ['React-Logo_Material002_0']: THREE.Mesh;
  };
  materials: {
    ['Material.002']: THREE.MeshStandardMaterial;
  };
};

export function ReactLogo(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useLoader(
    GLTFLoader,
    '/models/react_logo-processed.glb',
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/libs/draco/');
      loader.setDRACOLoader(dracoLoader);
    },
  ) as unknown as GLTFResult;

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const position = useMemo(() => {
    if (isMobile) {
      return [5, 3, 0] as const;
    }
    return [9, 1, 0] as const;
  }, [isMobile]);

  return (
    <Float floatIntensity={1.6}>
      <group {...props} dispose={null}>
        <group scale={0.3} position={position}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['React-Logo_Material002_0'].geometry}
            material={materials['Material.002']}
            position={[0, 7.935, 18.102]}
            rotation={[0, 0, -Math.PI / 2]}
            scale={[0.39, 0.39, 0.5]}
          />
        </group>
      </group>
    </Float>
  );
}

useGLTF.preload('/models/react_logo.glb');

export default ReactLogo;
