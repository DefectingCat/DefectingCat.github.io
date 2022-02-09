import prismaClient from '@prisma/client';
const { PrismaClient } = prismaClient;

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import strip from 'strip-markdown';

const prisma = new PrismaClient();

const postsDirectory = join(process.cwd(), 'public/posts');

/**
 * Read all post information.
 * @returns
 */
async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = await readdir(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      // Remove ".md" from file name to get id
      const file_name = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = join(postsDirectory, fileName);
      const fileContents = await readFile(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Process markdown to plain text
      const contentText = await remark()
        .use(strip)
        .process(matterResult.content);

      // Combine the data with the id
      return {
        file_name,
        // Add post description
        content: matterResult.content,
        desc: `${contentText.toString().slice(0, 100)}...`,
        ...{
          ...matterResult.data,
          date: matterResult.data.date.toISOString(),
        },
      };
    })
  );

  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

async function saveTagsToDB(posts) {
  const allTagsSet = new Set();

  // Save all tags into a Set.
  posts.map((post) => {
    if (post.tags) {
      Array.isArray(post.tags)
        ? post.tags.map((tag) => allTagsSet.add(tag))
        : allTagsSet.add(post.tags);
    }
  });
  const allTags = Array.from(allTagsSet);

  // Find tag in DB by name
  for (const tag of allTags) {
    const tagInDB = await prisma.tags.findFirst({
      select: {
        name: true,
      },
      where: {
        name: tag,
      },
    });

    // If don't exist, insert tag to DB.
    if (tagInDB == null) {
      const tagReadToDB = await prisma.tags.create({
        data: {
          name: tag,
        },
      });

      console.log(
        `Save tag ${tagReadToDB.name} sucessfuly! id: ${tagReadToDB.id}`
      );
    }
  }

  console.log('Save tag to DB done!');
}

async function saveCategoryToDB(posts) {
  const allCategoies = [];
  posts.map((post) => {
    if (post.categories) allCategoies.push(post.categories);
  });

  for (const category of allCategoies) {
    const categoryInDB = await prisma.category.findFirst({
      select: {
        name: true,
      },
      where: {
        name: category,
      },
    });

    // If don't exist, insert tag to DB.
    if (categoryInDB == null) {
      const categoryReadToDB = await prisma.category.create({
        data: {
          name: category,
        },
      });

      console.log(
        `Save category ${categoryReadToDB.name} sucessfuly! id: ${categoryReadToDB.id}`
      );
    }
  }

  console.log('Save category to DB done!');
}

async function savePostToDB(posts) {
  const xfy = await prisma.users.findFirst({
    select: {
      id: true,
      username: true,
    },
    where: {
      username: 'xfy',
    },
  });

  for (const post of posts) {
    const postInDB = await prisma.posts.findFirst({
      select: {
        file_name: true,
      },
      where: {
        file_name: post.file_name,
      },
    });

    // If don't exist, insert tag to DB.
    if (postInDB == null) {
      const {
        title,
        date,
        tags,
        categories,
        url,
        index_img,
        content,
        desc,
        file_name,
      } = post;

      const categoryId = await prisma.category.findFirst({
        select: {
          id: true,
        },
        where: {
          name: categories,
        },
      });

      const postReadToDB = await prisma.posts.create({
        data: {
          Users: {
            connect: {
              id: xfy.id,
            },
          },
          title,
          date,
          url,
          index_img: index_img ?? null,
          content,
          desc,
          file_name,
          tags: tags
            ? {
                connect: await findPostTag(tags),
              }
            : {},
          categories: {
            connect: {
              id: categoryId.id,
            },
          },
        },
      });

      console.log(
        `Save post ${postReadToDB.title} sucessfuly! id: ${postReadToDB.id}`
      );
    }
  }

  console.log('Save post to DB done!');
}

async function findPostTag(tags) {
  let tagIds = [];
  if (Array.isArray(tags)) {
    for (const tag of tags) {
      const tagInDB = await prisma.tags.findFirst({
        select: {
          id: true,
        },
        where: {
          name: tag,
        },
      });
      tagIds.push({ id: tagInDB.id });
    }
    return tagIds;
  } else {
    const tagInDB = await prisma.tags.findFirst({
      select: {
        id: true,
      },
      where: {
        name: tags,
      },
    });
    return { id: tagInDB.id };
  }
}

async function main() {
  const posts = await getSortedPostsData();
  await saveTagsToDB(posts);
  await saveCategoryToDB(posts);
  await savePostToDB(posts);
}

main()
  .then()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
