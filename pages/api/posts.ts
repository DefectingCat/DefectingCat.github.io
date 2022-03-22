import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MyMatters, Post } from 'types';
import { sortByDate } from 'lib/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[]>
) {
  const getPosts = () => {
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

    res.status(200).json(posts);
  };

  switch (req.method) {
    case 'GET':
      return getPosts();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
