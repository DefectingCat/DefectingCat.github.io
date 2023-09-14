import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const CloudModel = () => {
  const gltf = useLoader(
    GLTFLoader,
    './models/cloud_station/modelDraco.gltf',
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./libs/draco/');
      loader.setDRACOLoader(dracoLoader);
    },
  );

  return (
    <>
      <primitive object={gltf.scene} />
    </>
  );
};

export default CloudModel;
