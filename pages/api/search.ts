import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const search = async () => {
    const searchBody = req.body;
    console.log(searchBody);

    try {
      const { q } = searchBody;

      const result = await prisma.posts.findMany({
        where: {
          OR: [
            {
              content: {
                contains: q,
              },
            },
            {
              title: {
                contains: q,
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          date: true,
          url: true,
          desc: true,
        },
      });

      const data = {
        result,
      };

      return res.status(200).json(result);
    } catch {
      return res.status(404).json({
        message: 'Not found.',
      });
    }

    // try {
    //   const { name } = q;
    //   if (Array.isArray(name)) throw new Error();

    //   const user = await prisma.users.findFirst({
    //     select: {
    //       username: true,
    //       emil: true,
    //     },
    //     where: {
    //       username: name,
    //     },
    //   });
    //   user
    //     ? res.status(200).json(user)
    //     : res.status(404).json({
    //         message: 'Not found.',
    //       });
    // } catch (e) {
    //   return res.status(404).json({
    //     message: 'Not found.',
    //   });
    // }
  };

  switch (req.method) {
    case 'POST':
      return search();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
