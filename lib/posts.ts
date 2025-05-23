import path from 'path';
import fs from 'fs/promises';
import matter from 'gray-matter';
import { sortByDate } from 'lib/utils';
import { cache } from 'react';
import { MyMatters, Post } from 'types';

export const dataPath = 'content/posts';

/**
 * Read post meta info with gray-matter.
 * @param filename
 * @returns
 */
const readFileMeta = async (filename: string) => {
  const markdownWithMeta = await fs.readFile(
    path.join(dataPath, filename),
    'utf-8',
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

/**
 * Get posts list page.
 */
export const PostPerPage = 10;
export type PostPath = { page: string };
const postPathCallback = (prev: PostPath[], _: unknown, i: number) =>
  i + 1 > 2 ? prev.concat({ page: (i + 1).toString() }) : prev;
export const getPostListPath = async () => {
  const length = (await fs.readdir(path.join(dataPath))).length;
  const pages = Math.ceil(length / PostPerPage);
  return Array.from({ length: pages }).reduce<PostPath[]>(postPathCallback, [
    { page: '2' },
  ]);
};

/**
 * Replace file name.
 * @param filename
 * @returns
 */
const readFilePath = async (filename: string) => {
  const slug = filename.replace(/\.mdx$/, '');
  return {
    slug,
  };
};

/**
 * Read posts folder.
 * @returns
 */
export const allPostsPath = async () => {
  const files = await fs.readdir(path.join(dataPath));
  return await Promise.all(files.map(readFilePath));
};

/**
 * Read single postcontent.
 * @param slug
 * @returns
 */
export const readSinglePost = cache(async (slug: string) => {
  const filename = path.join(`${dataPath}/${slug}.mdx`);
  return await fs.readFile(filename, { encoding: 'utf-8' });
});
