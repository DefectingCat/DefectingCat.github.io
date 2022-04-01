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

  if (source.match(regex)) {
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
  }

  return [];
};
