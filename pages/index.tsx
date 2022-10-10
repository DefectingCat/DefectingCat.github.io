import cn from 'classnames';
import { getMousePosition } from 'lib/utils';
import dynamic from 'next/dynamic';
import Image from 'next/future/image';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import { InitFn, THREE, useThree } from 'rua-three';
import styles from 'styles/index/index.module.css';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import type { NextPageWithLayout } from 'types';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const Loading = dynamic(() => import('components/RUA/loading/RUALoading'));

const manager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(manager);

const rotationY = 0.4;
const rotationX = 0.18;

const Home: NextPageWithLayout = () => {
  const wrapper = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({
    width: 500,
    height: 300,
  });

  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  manager.onLoad = () => {
    setLoading(false);
    setTimeout(() => {
      setShowLoading(false);
    }, 300);
  };

  const setCanvasSize = useCallback(() => {
    if (!wrapper.current) return;
    const width = wrapper.current.clientWidth;
    const height = wrapper.current.clientHeight;
    setSize({
      width,
      height,
    });
  }, []);
  useEffect(() => {
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [setCanvasSize]);

  const init: InitFn = ({
    scene,
    camera,
    controls,
    frameArea,
    isOrbitControls,
    isPerspectiveCamera,
    addWindowEvent,
    addRenderCallback,
  }) => {
    if (isOrbitControls(controls)) {
      controls.enableRotate = false;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minDistance = 1;
      controls.minPolarAngle = Math.PI * 0.2;
      controls.maxPolarAngle = Math.PI * 0.5;
      controls.maxAzimuthAngle = Math.PI * 0.2;
    }

    const light = new THREE.SpotLight(0xffffff, 2, 100, 15);
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    scene.add(light);

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

      light.target = root;
      light.position.set(0, 2, 6);
      light.rotateX(Math.PI * 0.4);
      isPerspectiveCamera(camera) &&
        frameArea(boxSize * 0.8, boxSize, boxCenter, camera);

      controls.target.copy(boxCenter);
      controls.update();
      root.position.y += 0.1;
      camera.position.z -= 0.2;

      const halfWidth = Math.floor(window.innerWidth / 2);
      const halfHeight = Math.floor(window.innerHeight / 2);

      const updateMousePosition = (e: MouseEvent | globalThis.TouchEvent) => {
        const { x, y } = getMousePosition(e);
        // > 0 is right, < 0 is left
        // if (directionX > 0) root.rotation.y += 0.01;
        root.rotation.y = rotationY * (x - halfWidth / halfWidth);
        root.rotation.x = rotationX * (y - halfHeight / halfHeight);
      };

      addWindowEvent('mousemove', updateMousePosition, {
        passive: true,
      });
      addWindowEvent('touchmove', updateMousePosition, {
        passive: true,
      });
    };

    gltfLoader.load('./models/just_a_hungry_cat/scene.gltf', handleLoad);
  };
  const { ref } = useThree({
    init,
    ...size,
    alpha: true,
  });

  return (
    <>
      <Head>
        <title>RUA - HOME</title>
      </Head>

      <main className="h-[calc(100vh-142px)] flex justify-center items-center text-xl">
        <div className="z-0 flex flex-col w-full h-full max-w-4xl px-4 py-32 text-2xl">
          {/* <h1 className="pb-4 text-4xl">Hi there 👋, I&apos;m Arthur. </h1> */}
          <h1 className="flex pb-4 text-5xl">
            <span className={cn('font-Aleo font-semibold', styles.gradient)}>
              Hi there
            </span>
            <span className="ml-3">
              <Image
                src="/images/img/hands.svg"
                alt="hands"
                width={36}
                height={36}
              />
            </span>
          </h1>

          <div
            className="relative flex-1 overflow-hidden rounded-xl"
            ref={wrapper}
          >
            <canvas ref={ref} className="absolute top-0 left-0"></canvas>
            {showLoading && (
              <div
                className={cn(
                  'absolute top-0 left-0 z-10 ',
                  'items-center flex justify-center',
                  'w-full h-full transition-all duration-500',
                  'bg-white',
                  loading ? 'opacity-1' : 'opacity-0'
                )}
              >
                <Loading />
              </div>
            )}
          </div>
          {/* <p>I&apos;m a Front-end developer. Yes, that&apos;s mean</p>
            <p
              onMouseOver={() => setShowLang(true)}
              onMouseLeave={() => setShowLang(false)}
            >
              <span className={cn('font-Aleo font-semibold', style.gradient)}>
                I make websites{' '}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (and web apps)
              </span>
              <span className="text-sky-500 dark:text-sky-600 font-Aleo">
                .{' '}
              </span>
              The{' '}
              <span className={cn('font-Aleo', showLang && 'hidden')}>
                JavaScript
              </span>
              <span
                className={cn('hidden font-Aleo', showLang && '!inline-block')}
              >
                TypeScript
              </span>{' '}
              is my favorite language.
            </p>
            <p>
              I&apos;m not a creator. Just a little guy standing on the
              shoulders of giants with a little imagination.
            </p>
            <p>
              Open source is my passion. It&apos;s making everything be great.{' '}
            </p> */}
        </div>
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
