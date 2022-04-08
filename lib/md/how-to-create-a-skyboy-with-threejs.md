Image a camera inside a cube box. The cube box is our scene. just like `const scene = new THREE.Scene();`. The camera is our perspect camera.

```ts
new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
```

Now, we can see the inside of the cube box. The inside texture of the box is our sky. Our camera can see all six texture surround ours give ours the illusion the we are within a larger environment.

## Three.js setup

First, we need a little bit of setup. Let's create a sence and a camera.

```ts
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
```

One scene only has one camera. So we don't need add camera into the scene manually. The default camera position is in the center at `(0, 0, 0)`. We also need move a little bit of our camera position.

```ts
camera.position.set(0, 10, 22);
```

And now, We need render scene into our document. So we need a WebGL renderer.

```ts
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
```

With a little bit of setup:

```ts
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
```
