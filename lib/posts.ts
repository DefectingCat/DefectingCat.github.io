import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MyMatters, Post } from 'types';
import { sortByDate } from 'lib/utils';

/**
 * Read all posts with matter info.
 * @returns
 */
export const postLists = async (): Promise<Post[]> => {
  const files = fs.readdirSync(path.join('pages/p'));
  const posts = files
    .map((filename) => {
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
    })
    .sort(sortByDate);

  console.log(posts);

  return posts;
};
