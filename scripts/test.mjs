import prismaClient from '@prisma/client';
const { PrismaClient } = prismaClient;

const prisma = new PrismaClient();

async function main() {
  const content = await prisma.posts.findMany({
    take: 1,
    include: {
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  console.log(content);
}

main().then();