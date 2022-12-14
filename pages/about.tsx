import TWEEN from '@tweenjs/tween.js';
import clsx from 'clsx';
import MainLayout from 'layouts/MainLayout';
import { gltfLoader, manager } from 'lib/gltfLoader';
import { getMousePosition } from 'lib/utils';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useRef, useState } from 'react';
import { InitFn, THREE, useThree } from 'rua-three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { NextPageWithLayout } from 'types';

const Loading = dynamic(() => import('components/RUA/loading/RUALoading'), {
  suspense: true,
});

const rotationY = 0.4;
const rotationX = 0.2;

const About: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  manager.onLoad = () => {
    setLoading(false);
    setTimeout(() => {
      setShowLoading(false);
    }, 300);
  };

  // After model loading, set theme to dark mode.
  const restore = useRef(false);
  const mounted = useRef(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  // setDarkMode is async called by setTimeout, when component is unmounted
  // it should not be called.
  const setDarkMode = () => {
    if (!showLoading) return;
    if (currentTheme === 'dark') return;
    if (!mounted.current) return;
    restore.current = true;
    document.body.style.transition = 'all 1.2s ease-out';
    setTheme('dark');
  };
  useEffect(
    () => {
      mounted.current = true;

      return () => {
        mounted.current = false;
        if (!restore.current) return;
        setTheme('light');
        document.body.style.transition = 'all 0.3s ease-out';
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const init: InitFn = ({
    scene,
    controls,
    camera,
    isOrbitControls,
    frameArea,
    isPerspectiveCamera,
    addRenderCallback,
    addWindowEvent,
  }) => {
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    if (isOrbitControls(controls)) {
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.enableRotate = false;
    }

    const handleLoad = (gltf: GLTF) => {
      const root = gltf.scene;
      scene.add(root);

      const clock = new THREE.Clock();
      const mixer = new THREE.AnimationMixer(root);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
      addRenderCallback(() => {
        mixer.update(clock.getDelta());
      });

      const box = new THREE.Box3().setFromObject(root);
      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      if (isPerspectiveCamera(camera)) {
        frameArea(boxSize, boxSize, boxCenter, camera);
      }
      controls.target.copy(boxCenter);
      controls.update();

      // Rotate 180 degress
      root.rotation.y = Math.PI * 2;

      // Enter animation
      const entryValue = {
        rotationY: root.rotation.y,
        meshY: root.position.y,
        cameraY: camera.position.y,
        z: camera.position.z,
      };
      const enter = new TWEEN.Tween(entryValue)
        .to(
          {
            rotationY: 0,
            meshY: entryValue.meshY - 1,
            cameraY: entryValue.cameraY + 0.5,
            z: entryValue.z - 16,
          },
          1200
        )
        .onUpdate((obj) => {
          // root.rotation.y = obj.rotationY;
          root.position.y = obj.meshY;
          camera.position.y = obj.cameraY;
          camera.position.z = obj.z;
        })
        .easing(TWEEN.Easing.Circular.Out)
        .onComplete(() => {
          document.body.style.transition = 'all 0.3s ease-out';
        });
      setTimeout(() => {
        enter.start();
        setDarkMode();
      }, 1000);

      // Render animation
      addRenderCallback((time) => {
        TWEEN.update(time / 0.001);
      });

      const halfWidth = Math.floor(window.innerWidth / 2);
      const halfHeight = Math.floor(window.innerHeight / 2);

      const updateMousePosition = (e: MouseEvent | globalThis.TouchEvent) => {
        const { x, y } = getMousePosition(e);
        // > 0 is right, < 0 is left
        // if (directionX > 0) root.rotation.y += 0.01;
        root.rotation.y = rotationY * ((x - halfWidth) / halfWidth);
        root.rotation.x = rotationX * ((y - halfHeight) / halfHeight);
      };

      addWindowEvent('mousemove', updateMousePosition, {
        passive: true,
      });
      addWindowEvent('touchmove', updateMousePosition, {
        passive: true,
      });
    };

    gltfLoader.load('./models/cloud_station/modelDraco.gltf', handleLoad);
  };

  const { ref } = useThree({
    init,
    alpha: true,
  });

  return (
    <>
      <div className="fixed top-0 left-0 -z-10">
        <canvas ref={ref} className="w-full h-full"></canvas>
        <Suspense fallback>
          {showLoading && (
            <div
              className={clsx(
                'absolute top-0 left-0',
                'items-center flex justify-center',
                'w-full h-full transition-all duration-500',
                'bg-white dark:bg-rua-gray-900',
                loading ? 'opacity-1' : 'opacity-0'
              )}
            >
              <Loading />
            </div>
          )}
        </Suspense>
      </div>

      <main className="h-[calc(100vh-142px)] flex flex-col">
        <div
          className={clsx(
            'flex max-w-3xl',
            'px-10 py-4 mx-auto lg:px-0 lg:py-10'
          )}
        >
          <h1 className="text-5xl font-semibold font-Barlow">About</h1>
        </div>
      </main>
    </>
  );
};

About.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default About;
