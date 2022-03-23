import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MyMatters, Post } from 'types';
import { sortByDate } from 'lib/utils';

/**
 * Read post meta info with gray-matter.
 * @param filename
 * @returns
 */
const readFileMeta = (filename: string) => {
  const markdownWithMeta = fs.readFileSync(
    path.join('pages/p', filename),
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
  const files = fs.readdirSync(path.join('pages/p'));
  const posts = files.map(readFileMeta).sort(sortByDate);

  return posts;
};
