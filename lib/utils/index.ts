export const sortByDate = (
  { date: a }: { date: string },
  { date: b }: { date: string }
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
export const generateToc = (source: string) => {
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
};

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
