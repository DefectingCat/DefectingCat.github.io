import type { NextApiRequest, NextApiResponse } from 'next';
import { Post } from 'types';
import { postLists } from 'lib/posts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[]>
) {
  const getPosts = async () => {
    const posts = await postLists();
    res.status(200).json(posts);
  };

  switch (req.method) {
    case 'GET':
      return getPosts();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
