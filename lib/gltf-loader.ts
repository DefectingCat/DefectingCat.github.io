import { THREE } from 'rua-three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const manager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(manager);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./libs/draco/');
dracoLoader.setDecoderConfig({ type: 'wasm' });
gltfLoader.setDRACOLoader(dracoLoader);

export { manager, gltfLoader, dracoLoader };
