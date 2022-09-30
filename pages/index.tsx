import cn from 'classnames';
import dynamic from 'next/dynamic';
import Image from 'next/future/image';
import Head from 'next/head';
import { useRef } from 'react';
import { InitFn, THREE, useThree } from 'rua-three';
import style from 'styles/index/index.module.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import type { NextPageWithLayout } from 'types';

const MainLayout = dynamic(() => import('layouts/MainLayout'));

const gltfLoader = new GLTFLoader();

const Home: NextPageWithLayout = () => {
  // const [showLang, setShowLang] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  const init: InitFn = ({ scene, camera, controls, renderer, frameArea }) => {
    camera.position.set(0, 5, 5);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const light = new THREE.SpotLight(0xffffff);
    camera.add(light);
    // scene.add(light);

    gltfLoader.load('/models/just_a_hungry_cat/scene.gltf', (gltf) => {
      const root = gltf.scene;
      scene.add(root);

      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      light.target = root;
      frameArea(boxSize * 0.8, boxSize, boxCenter, camera);

      controls.maxDistance = boxSize * 10;
      controls.target.copy(boxCenter);
      controls.update();
    });

    if (wrapper.current) {
      renderer.setSize(
        wrapper.current.clientWidth,
        wrapper.current.clientHeight
      );
    }
  };
  const { ref } = useThree({
    init,
    width: 500,
    height: 300,
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
          <h1 className="flex pb-4 text-4xl">
            <span className={cn('font-Aleo font-semibold', style.gradient)}>
              Hi there
            </span>
            <Image
              src="/images/img/hands.svg"
              alt="hands"
              width={36}
              height={36}
              className="ml-3"
            />
          </h1>

          <div className="flex-1" ref={wrapper}>
            <canvas ref={ref}></canvas>
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
