import { cache } from 'react';
import * as THREE from 'three';

export const sortByDate = (
  { date: a }: { date: string },
  { date: b }: { date: string },
) => {
  if (a < b) {
    return 1;
  } else if (a > b) {
    return -1;
  } else {
    return 0;
  }
};

/**
 * Read post head to mark TOC
 * @param source
 * @returns
 */
export const getHeadings = (source: string) => {
  const regex = /<h2 id="(.*?)">(.*?)<\/h2>/g;
  const linkRegx = /id="(.*?)"/;

  return source.match(regex)?.map((heading) => {
    const headingText = heading
      .replace(/<h2 id="(.*?)">/, '')
      .replace(/<\/h2>/, '');

    const link = '#' + heading.match(linkRegx)?.[1];

    return {
      text: headingText,
      link,
    };
  });
};

export type SingleToc = {
  level: number;
  head: string;
  link: string;
  children: SingleToc[];
};
/**
 * Generate post toc
 * @param source
 * @returns
 */
export const generateToc = cache((source: string) => {
  const regex = /^#{2,3}(?!#)(.*)/gm;

  let lastH2: SingleToc | null = null;
  const toc: SingleToc[] = [];

  source.match(regex)?.map((h) => {
    const heading = h.split(' ');
    const level = heading[0].length;
    const head = h.substring(level + 1);
    const link = `#${head
      .toLocaleLowerCase()
      .replace(/ /g, '-')
      .replace(/\./g, '')}`;

    switch (level) {
      case 2: {
        lastH2 = {
          level,
          head,
          link,
          children: [],
        };
        toc.push(lastH2);
        break;
      }
      case 3: {
        lastH2?.children.push({
          level,
          head,
          link,
          children: [],
        });
        break;
      }
    }
  });

  return toc;
});

/**
 * Get mouse or touch position on screen.
 * @param e Mouse or Touch event.
 * @returns
 */
export const getMousePosition = (e: MouseEvent | globalThis.TouchEvent) => {
  return e instanceof MouseEvent
    ? {
        x: e.clientX,
        y: e.clientY,
      }
    : {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
};

type Debounce = {
  <T extends unknown[], R>(
    fn: (...arg: T) => R,
    ms: number,
  ): (this: unknown, ...arg: T) => void;
};
export const debounce: Debounce = (fn, ms) => {
  let timer: NodeJS.Timeout;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
};

export const frameArea = (
  sizeToFitOnScreen: number,
  boxSize: number,
  boxCenter: THREE.Vector3,
  camera: THREE.PerspectiveCamera,
) => {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
  // compute a unit vector that points in the direction the camera is now
  // in the xz plane from the center of the box
  const direction = new THREE.Vector3()
    .subVectors(camera.position, boxCenter)
    .multiply(new THREE.Vector3(1, 0, 1))
    .normalize();

  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  // pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
};

export const isUrl = (url: string) => {
  const urlRegex = new RegExp(
    '^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$',
  );
  return urlRegex.test(url);
};
