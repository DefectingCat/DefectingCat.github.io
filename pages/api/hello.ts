// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Users } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const test = await prisma.users.findFirst({
    where: {
      username: 'test',
    },
    select: {
      username: true,
      Tweets: {
        select: {
          content: true,
        },
      },
    },
  });
  res.status(200).json(test);
}
