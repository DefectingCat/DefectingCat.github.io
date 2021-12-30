import fs from 'fs/promises';
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

export interface AllPostsData extends MyMatters {
  id: string;
  desc: string;
}

/**
 * Get all sorted posts
 * @returns
 */
export async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = await fs.readdir(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Process markdown to plain text
      const contentText = await remark()
        .use(strip)
        .process(matterResult.content);

      // Combine the data with the id
      return {
        id,
        // Add post description
        desc: `${contentText.toString().slice(0, 100)}...`,
        ...({
          ...matterResult.data,
          date: matterResult.data.date.toISOString(),
        } as MyMatters),
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

/**
 * Get all posts without description and sorted.
 * @returns
 */
export async function getAllPosts() {
  // Get file names under /posts
  const fileNames = await fs.readdir(postsDirectory);

  const allPosts = await Promise.all(
    fileNames.map(async (file) => {
      // Remove ".md" from file name to get id
      const id = file.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, file);
      const fileContents = await fs.readFile(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      return {
        id,
        // Post content,
        content: matterResult.content,
        ...({
          ...matterResult.data,
          date: matterResult.data.date.toISOString(),
        } as MyMatters),
      };
    })
  );

  // Sort posts by date
  return allPosts.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

/**
 * Paging, get all posts length
 * @returns
 */
export async function getAllPostNum() {
  // Get file names under /posts
  const fileNames = await fs.readdir(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       num: '2' // num of page
  //     }
  //   },
  //   {
  //     params: {
  //       num: '3'
  //     }
  //   }
  // ]
  const pagingSize = 10;
  const allPages = Math.ceil(fileNames.length / pagingSize);

  const numPages = [];
  for (let i = 2; i <= allPages; i++) {
    numPages.push({
      params: {
        num: i.toString(),
      },
    });
  }
  return numPages;
}

export interface PagingData {
  totalNum: number;
  pagingSize: number;
  allPages: number;
  postDatas: AllPostsData[];
}

export async function getPagingData(start?: string) {
  const allPostsData = await getSortedPostsData();

  const totalNum = allPostsData.length;
  const pagingSize = 10;
  const allPages = Math.ceil(totalNum / pagingSize);

  const startIndex = start ? (Number(start) - 1) * pagingSize : 0;

  const postDatas = allPostsData.slice(startIndex, startIndex + 10);

  return {
    totalNum,
    pagingSize,
    allPages,
    postDatas,
  };
}

export async function getAllPostSlugs() {
  const allPosts = await getAllPosts();

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return allPosts.map((post) => {
    return {
      params: {
        slug: post.url,
      },
    };
  });
}

export interface MyPost extends MyMatters {
  id: string;
  content: string;
}

export async function getPostData(slug: string) {
  const allPosts = await getAllPosts();
  const post = allPosts.find((post) => post.url === slug)!;

  // Combine the data with the id
  return {
    ...post,
    id: slug,
  };
}

/**
 * Get archive data with date.
 * Data like: {
 *   2021: [ post ]
 * }
 * @param allPostsData
 */
export const getArchiveData = async () => {
  const archiveData: {
    [key: string]: MyPost[];
  } = {};
  const allPosts = await getAllPosts();

  allPosts.map((post) => {
    const fullYear = new Date(post.date).getFullYear();

    archiveData?.[fullYear]
      ? archiveData[fullYear].push(post)
      : (archiveData[fullYear] = [post]);
  });

  return {
    archiveData,
    archiveKeys: Object.keys(archiveData).reverse(),
  };
};
