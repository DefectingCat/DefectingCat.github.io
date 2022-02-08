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

    try {
      const { q } = searchBody;

      if (!q) throw new Error();

      const queryOrder: {
        orderBy: {
          title: 'asc';
        };
      } = {
        orderBy: {
          title: 'asc',
        },
      };

      const queryWhere = {
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
      };

      const querySelect = {
        select: {
          id: true,
          title: true,
          date: true,
          url: true,
          desc: true,
        },
      };

      const count = await prisma.posts.count(queryWhere);

      let data = {};
      const totalPage = Math.ceil(count / 10);

      if (count > 10) {
        const page = searchBody.page ?? 1;

        const result = await prisma.posts.findMany({
          take: 10,
          skip: (page - 1) * 10,
          ...queryOrder,
          ...queryWhere,
          ...querySelect,
        });

        data = {
          page,
          result,
          hasNext: totalPage - page > 0,
          totalPage,
          message: 'ok',
        };
      } else {
        const result = await prisma.posts.findMany({
          ...queryOrder,
          ...queryWhere,
          ...querySelect,
        });

        data = {
          page: 1,
          result,
          hasNext: false,
          totalPage,
          message: 'ok',
        };
      }

      return res.status(200).json(data);
    } catch {
      return res.status(404).json({
        message: 'Not found.',
      });
    }
  };

  switch (req.method) {
    case 'POST':
      return search();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
