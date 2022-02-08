import prismaClient from '@prisma/client';
const { PrismaClient } = prismaClient;

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.posts.findMany({
    orderBy: {
      title: 'asc',
    },
    where: {
      OR: [
        {
          content: {
            contains: 'javascript',
          },
        },
        {
          title: {
            contains: 'javascript',
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

  const count = await prisma.posts.count({
    where: {
      OR: [
        {
          content: {
            contains: 'javascript',
          },
        },
        {
          title: {
            contains: 'javascript',
          },
        },
      ],
    },
  });

  console.log(count);
}

main().then();
