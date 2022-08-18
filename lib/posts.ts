import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { MyMatters, Post } from 'types';
import { sortByDate } from 'lib/utils';

const dataPath = 'data/posts';

/**
 * Read post meta info with gray-matter.
 * @param filename
 * @returns
 */
const readFileMeta = async (filename: string) => {
  const markdownWithMeta = await fs.readFile(
    path.join(dataPath, filename),
    'utf-8'
  );
  const slug = filename.replace(/\.mdx$/, '');
  const { data: meta } = matter(markdownWithMeta);
  return {
    slug,
    ...({ ...meta } as MyMatters),
  };
};

/**
 * Read all posts with matter info.
 * @returns
 */
export const postLists = async (): Promise<Post[]> => {
  const files = await fs.readdir(path.join(dataPath));
  return (await Promise.all(files.map(readFileMeta))).sort(sortByDate);
};

const readFilePath = async (filename: string) => {
  const slug = filename.replace(/\.mdx$/, '');
  return {
    params: {
      slug,
    },
  };
};

export const allPostsPath = async () => {
  const files = await fs.readdir(path.join(dataPath));
  return await Promise.all(files.map(readFilePath));
};

export const readSinglePost = async (slug: string) => {
  const filename = path.join(`${dataPath}/${slug}.mdx`);
  return await fs.readFile(filename, { encoding: 'utf-8' });
};
