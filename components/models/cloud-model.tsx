import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const CloudModel = () => {
  const mixer = useRef<THREE.AnimationMixer | null>(null);

  const camera = useThree((state) => state.camera);

  const gltf = useLoader(
    GLTFLoader,
    './models/cloud_station/modelDraco.gltf',
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./libs/draco/');
      loader.setDRACOLoader(dracoLoader);
    },
  );
  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      mixer.current?.clipAction(clip).play();
    });
    gltf.scene.position.set(0, 0, 0);
    camera.position.y = 2.2;
    camera.lookAt(0, 1.2, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update camera position
  const vec = useRef(new THREE.Vector3());
  useFrame(({ mouse, camera }, delta) => {
    vec.current.set(-mouse.x * 2, -mouse.y * 2 + 2.2, camera.position.z);
    mixer.current?.update(delta);
    camera.position.lerp(vec.current, 0.025);
    camera.lookAt(0, 1.2, 0);
  });

  return (
    <>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
      <primitive object={gltf.scene} />
      {/* <OrbitControls /> */}
      <axesHelper args={[5]} />
    </>
  );
};

export default CloudModel;
