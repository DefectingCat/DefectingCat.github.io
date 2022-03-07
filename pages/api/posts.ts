import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getPosts = async () => {
    const totalNum = await prisma.posts.count();
    const posts = await prisma.posts.findMany({
      orderBy: {
        date: 'desc',
      },
      take: 10,
      select: {
        id: true,
        title: true,
        date: true,
        desc: true,
        index_img: true,
        url: true,
        tags: {
          select: {
            name: true,
          },
        },
      },
    });
    const pagingSize = 10;
    const allPages = Math.ceil(totalNum / pagingSize);

    try {
      return res.status(200).json({
        allPages,
        posts,
      });
    } catch {
      return res.status(404).json({
        message: 'Not found.',
      });
    }
  };

  switch (req.method) {
    case 'GET':
      return getPosts();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
