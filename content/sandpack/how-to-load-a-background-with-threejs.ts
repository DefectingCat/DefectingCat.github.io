export const firstScene = `import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function App() {
  const ref = useRef(null);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({
      canvas: ref.current,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    const render = (time) => {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render(0);
    }
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <>
      <canvas ref={ref}></canvas>
    </>
  )
}`;

export const loadBackground = `import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const manager = new THREE.LoadingManager();
manager.onProgress = (item, loaded, total) => {
  console.log(loaded, total);
};

export default function App() {
  const ref = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const sky = new THREE.CubeTextureLoader(manager).load([
      "https://raw.githubusercontent.com/DefectingCat/three-playground/master/src/assets/images/corona/corona_ft.png",
      "https://raw.githubusercontent.com/DefectingCat/three-playground/master/src/assets/images/corona/corona_bk.png",
      "https://raw.githubusercontent.com/DefectingCat/three-playground/master/src/assets/images/corona/corona_up.png",
      "https://raw.githubusercontent.com/DefectingCat/three-playground/master/src/assets/images/corona/corona_dn.png",
      "https://raw.githubusercontent.com/DefectingCat/three-playground/master/src/assets/images/corona/corona_rt.png",
      "https://raw.githubusercontent.com/DefectingCat/three-playground/master/src/assets/images/corona/corona_lf.png"
    ]);
    scene.background = sky;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 0);
    camera.up.set(0, 0, 1);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: ref.current
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    const controls = new OrbitControls(camera, ref.current);
    controls.enablePan = false;
    controls.target.set(0, 0, 0);
    controls.update();
    const render = (time) => {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render(0);
    }
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);
  return (
    <>
      <canvas ref={ref}></canvas>
    </>
  );
}
`;

export const resetStyles = `* {
  padding: 0;
  margin: 0;
}`;
