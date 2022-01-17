import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import strip from 'strip-markdown';

const postsDirectory = path.join(process.cwd(), 'public/posts');

export interface MyMatters {
  title: string;
  date: string;
  tags: string;
  categories: string;
  url: string;
  index_img: string;
}

export const fileNames = fs.readdirSync(postsDirectory);

const sortByDate = (
  { date: a }: { date: string },
  { date: b }: { date: string }
) => {
  if (a < b) {
    return 1;
  } else if (a > b) {
    return -1;
  } else {
    return 0;
  }
};

const readMatters = (fileName: string) => {
  // Remove ".md" from file name to get id
  const id = fileName.replace(/\.md$/, '');

  // Read markdown file as string
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  return {
    id,
    matterResult,
  };
};

const postWithMatter = (fileName: string) => {
  const { id, matterResult } = readMatters(fileName);

  // Combine the data with the id
  return {
    id,
    ...({
      ...matterResult.data,
      date: matterResult.data.date.toISOString(),
    } as MyMatters),
  };
};

const postWithDescription = (fileName: string) => {
  const { id, matterResult } = readMatters(fileName);

  // Process markdown to plain text
  const contentText = remark().use(strip).processSync(matterResult.content);

  // Combine the data with the id
  return {
    id,
    desc: `${contentText.toString().slice(0, 100)}...`,
    ...({
      ...matterResult.data,
      date: matterResult.data.date.toISOString(),
    } as MyMatters),
  };
};

const postWithContent = (fileName: string) => {
  const { id, matterResult } = readMatters(fileName);

  // Process markdown to plain text
  const contentText = remark().use(strip).processSync(matterResult.content);

  // Combine the data with the id
  return {
    id,
    // Add post description
    content: matterResult.content,
    desc: `${contentText.toString().slice(0, 100)}...`,
    ...({
      ...matterResult.data,
      date: matterResult.data.date.toISOString(),
    } as MyMatters),
  };
};

const allPostsWithMatter = fileNames
  .map((fileName) => postWithMatter(fileName))
  .sort(sortByDate);

const allPostsWithDescription = fileNames
  .map((fileName) => postWithDescription(fileName))
  .sort(sortByDate);

const allPostsWithContent = fileNames
  .map((fileName) => postWithContent(fileName))
  .sort(sortByDate);

export { allPostsWithMatter, allPostsWithDescription, allPostsWithContent };

export type AllPostsWithMatter = ReturnType<typeof postWithMatter>;
export type AllPostsWithDescription = ReturnType<typeof postWithDescription>;
export type AllPostsWithContent = ReturnType<typeof postWithContent>;

/**
 * Old funtion
 * Get all sorted posts
 * @returns
 */
// function getSortedPostsData() {
//   // Get file names under /posts
//   const allPostsData = fileNames.map((fileName) => {
//     // Remove ".md" from file name to get id
//     const id = fileName.replace(/\.md$/, '');

//     // Read markdown file as string
//     const fullPath = path.join(postsDirectory, fileName);
//     const fileContents = fs.readFileSync(fullPath, 'utf8');

//     // Use gray-matter to parse the post metadata section
//     const matterResult = matter(fileContents);

//     // Process markdown to plain text
//     const contentText = remark().use(strip).processSync(matterResult.content);

//     // Combine the data with the id
//     return {
//       id,
//       // Add post description
//       content: matterResult.content,
//       desc: `${contentText.toString().slice(0, 100)}...`,
//       ...({
//         ...matterResult.data,
//         date: matterResult.data.date.toISOString(),
//       } as MyMatters),
//     };
//   });

//   // Sort posts by date
//   return allPostsData.sort(({ date: a }, { date: b }) => {
//     if (a < b) {
//       return 1;
//     } else if (a > b) {
//       return -1;
//     } else {
//       return 0;
//     }
//   });
// }
