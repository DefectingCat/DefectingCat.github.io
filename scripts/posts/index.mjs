/* @ts-check */
import fs from 'fs/promises';
import path from 'path';

const dataPath = 'content/posts';

/**
 * Build post information for Algolia search.
 * @param filename
 * @returns
 */
const postLists = async () => {
  const files = await fs.readdir(path.join(dataPath));

  const myPosts = [];

  const getFiles = async (f) => {
    const content = await fs.readFile(path.join(dataPath, f), 'utf-8');
    // const { content: meta, content } = matter(markdownWithMeta);

    const slug = f.replace(/\.mdx$/, '');
    const regex = /^#{2,3}(?!#)(.*)/gm;

    let lastH2 = '';

    const getContent = (h) => {
      const heading = h.split(' ');
      const level = heading[0].length;
      const head = h.substring(level + 1);
      const url = `https://rua.plus/p/${slug}#${head
        .toLocaleLowerCase()
        .replace(/ /g, '-')}`;
      const record = {
        content: null,
        hierarchy: {
          lvl0: 'Post',
          lvl1: slug,
          lvl2: head,
        },
        type: `lvl${level}`,
        objectID: url,
        url,
      };

      switch (level) {
        case 2: {
          myPosts.push(record);
          lastH2 = head;
          break;
        }
        case 3: {
          myPosts.push({
            ...record,
            hierarchy: {
              ...record.hierarchy,
              lvl2: lastH2,
              lvl3: h.substring(level + 1),
            },
          });
          break;
        }
      }
    };
    content.match(regex)?.map(getContent);

    myPosts.push({
      content: null,
      hierarchy: {
        lvl0: 'Post',
        lvl1: slug,
      },
      type: 'lvl1',
      objectID: `https://rua.plus/p/${slug}`,
      url: `https://rua.plus/p/${slug}`,
    });
  };
  await Promise.all(files.map(getFiles));

  return myPosts;
};

export default postLists;
