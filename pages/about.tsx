import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { InitFn, useThree, THREE } from 'rua-three';
import { NextPageWithLayout } from 'types';
import TWEEN from '@tweenjs/tween.js';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const glftLoader = new GLTFLoader();
const rotationY = 0.4;
const rotationX = 0.2;

const MainLayout = dynamic(() => import('layouts/MainLayout'));

const About: NextPageWithLayout = () => {
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
          1000
        )
        .onUpdate((obj) => {
          // root.rotation.y = obj.rotationY;
          root.position.y = obj.meshY;
          camera.position.y = obj.cameraY;
          camera.position.z = obj.z;
        })
        .easing(TWEEN.Easing.Circular.Out);
      setTimeout(() => {
        enter.start();
      }, 1000);

      // Render animation
      addRenderCallback((time) => {
        TWEEN.update(time / 0.001);
      });

      const halfWidth = Math.floor(window.innerWidth / 2);
      const halfHeight = Math.floor(window.innerHeight / 2);

      const updateMousePosition = (e: MouseEvent | globalThis.TouchEvent) => {
        let x;
        let y;
        if (e instanceof MouseEvent) {
          x = e.clientX;
          y = e.clientY;
        } else {
          x = e.touches[0].clientX;
          y = e.touches[0].clientY;
        }

        // > 0 is right, < 0 is left
        const directionX = x - halfWidth;
        const directionY = y - halfHeight;

        // if (directionX > 0) root.rotation.y += 0.01;
        root.rotation.y = rotationY * (directionX / halfWidth);
        root.rotation.x = rotationX * (directionY / halfHeight);
      };

      addWindowEvent('mousemove', updateMousePosition, {
        passive: true,
      });
      addWindowEvent('touchmove', updateMousePosition, {
        passive: true,
      });
    };

    glftLoader.load('./models/cloud_station/scene.gltf', handleLoad);
  };

  const { ref } = useThree({
    init,
    alpha: true,
  });

  return (
    <>
      <canvas ref={ref} className="fixed top-0 left-0 -z-10"></canvas>

      <main className="h-[calc(100vh-142px)] flex flex-col">
        <div
          className={classNames(
            'flex max-w-3xl',
            'px-10 py-4 mx-auto lg:px-0 lg:py-10'
          )}
        >
          {/* <div className="w-16 h-16 lg:w-[72px] lg:h-[72px]">
            <Image
              src={avatar}
              alt="Avatar"
              priority
              width={72}
              height={72}
              className="rounded-full"
            />
          </div>

          <div className="pl-4 text-xl lg:text-2xl lg:pl-10">
            <h1 className="font-semibold font-Barlow">
              Arthur / Defectink / xfy
            </h1>
            <div className="h-[1px] rounded-lg bg-gray-400"></div>
            <div className="text-base lg:text-lg">
              Long may the sun shine ☀️
            </div>
          </div> */}
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
