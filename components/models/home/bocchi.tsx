import { Float, useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { JSX, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import * as THREE from 'three';
import { DRACOLoader, GLTF, GLTFLoader } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh;
    Object_6: THREE.Mesh;
    Object_8: THREE.Mesh;
    Object_10: THREE.Mesh;
    Object_12: THREE.Mesh;
    Object_14: THREE.Mesh;
    Object_16: THREE.Mesh;
  };
  materials: {
    main: THREE.MeshStandardMaterial;
    material: THREE.MeshStandardMaterial;
    yellow: THREE.MeshStandardMaterial;
    blue: THREE.MeshStandardMaterial;
    glass: THREE.MeshPhysicalMaterial;
  };
};

const BocchiRubbishBin = (props: JSX.IntrinsicElements['group']) => {
  const { nodes, materials } = useLoader(
    GLTFLoader,
    '/models/bocchi_the_rock-processed.glb',
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
    return [-12, 7, 0] as const;
  }, [isMobile]);

  return (
    <Float floatIntensity={2}>
      <group
        {...props}
        dispose={null}
        position={position}
        rotation={[Math.PI / 10, Math.PI / 10, 0]}
        scale={0.7}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials.main}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_6.geometry}
          material={materials.material}
          position={[0, 0.375, -0.099]}
          rotation={[0.21, 0, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_8.geometry}
          material={materials.yellow}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_10.geometry}
          material={materials.blue}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_12.geometry}
          material={materials.main}
          position={[0, 0.758, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_14.geometry}
          material={materials.glass}
          position={[0.856, 0.277, 1.046]}
          rotation={[-0.033, 0.088, 1.429]}
          scale={[-0.175, 0.175, 0.175]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_16.geometry}
          material={materials.glass}
          position={[-0.852, 0.277, 1.046]}
          rotation={[-0.032, -0.024, -1.413]}
          scale={0.175}
        />
      </group>
    </Float>
  );
};

useGLTF.preload('/models/bocchi_the_rock-processed.glb');

export default BocchiRubbishBin;
