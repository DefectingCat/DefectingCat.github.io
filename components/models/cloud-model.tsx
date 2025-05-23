import { easings, useSpring } from '@react-spring/three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import useRuaTheme from 'lib/hooks/use-rua-theme';
import { getMousePosition } from 'lib/utils';
import { useEffect, useRef } from 'react';
import useStore from 'store';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { rotationX, rotationY } from './home-model';

const CloudModel = () => {
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const toggleLoading = useStore((state) => state.toggleLoading);
  const camera = useThree((state) => state.camera);

  // After model loading, set theme to dark mode.
  const restore = useRef(false);
  const { theme, handleTheme } = useRuaTheme();
  // setDarkMode is async called by setTimeout, when component is unmounted
  // it should not be called.
  const setDarkMode = () => {
    if (theme === 'mocha') return;
    restore.current = true;
    document.body.style.transition = 'all 1.2s ease-out';
    handleTheme('mocha');
  };
  const [_, api] = useSpring(
    {
      z: camera.position.z,
      config: {
        duration: 1200,
        easing: easings.easeOutCirc,
      },
      onChange: (e) => {
        camera.position.z = Number(e.value.z);
      },
    },
    [],
  );

  const gltf = useLoader(
    GLTFLoader,
    '/models/cloud_station/modelDraco.gltf',
    (loader) => {
      toggleLoading(true);
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/libs/draco/');
      loader.setDRACOLoader(dracoLoader);
    },
  );
  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      mixer.current?.clipAction(clip).play();
    });
    gltf.scene.position.set(0, 0, 0);
    camera.lookAt(0, 1, 0);
    toggleLoading(false);

    const halfWidth = Math.floor(window.innerWidth / 2);
    const halfHeight = Math.floor(window.innerHeight / 2);

    const moveHandler = (e: MouseEvent | globalThis.TouchEvent) => {
      const { x, y } = getMousePosition(e);
      // > 0 is right, < 0 is left
      // if (directionX > 0) root.rotation.y += 0.01;
      gltf.scene.rotation.x = rotationX * ((y - halfHeight) / halfHeight);
      gltf.scene.rotation.y = rotationY * ((x - halfWidth) / halfWidth);
    };
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('touchmove', moveHandler);

    setTimeout(() => {
      api.start({
        z: camera.position.z - 5.2,
      });
      setDarkMode();
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('touchmove', moveHandler);

      if (!restore.current) return;
      handleTheme('latte');
      document.body.style.transition = 'all 0.3s ease-out';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update camera position
  // const vec = useRef(new THREE.Vector3());
  useFrame((_, delta) => {
    mixer.current?.update(delta);
    // vec.current.set(-mouse.x * 3, -mouse.y * 3 + 2.2, camera.position.z);
    // camera.position.lerp(vec.current, 0.025);
    // camera.lookAt(0, 1.2, 0);
  });

  return (
    <>
      <primitive object={gltf.scene} />
      {/* <OrbitControls /> */}
      {/* <axesHelper args={[5]} /> */}
    </>
  );
};

export default CloudModel;
