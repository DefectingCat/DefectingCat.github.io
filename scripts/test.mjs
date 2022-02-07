import prismaClient from '@prisma/client';
const { PrismaClient } = prismaClient;

const prisma = new PrismaClient();

async function main() {
  const content = await prisma.posts.findMany({
    where: {
      OR: [
        {
          content: {
            contains: 'rust',
          },
        },
        {
          title: {
            contains: 'rust',
          },
        },
      ],
    },
    select: {
      title: true,
    },
  });

  console.log(content);
}

main().then();
