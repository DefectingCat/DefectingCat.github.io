import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = async () => {
    const q = req.body;
    console.log(q);

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
      return auth();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
