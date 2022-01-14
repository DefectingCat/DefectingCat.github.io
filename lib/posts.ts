import type { AllPostsWithMatter, AllPostsWithDescription } from './readPosts';
import {
  fileNames,
  allPostsWithMatter,
  allPostsWithDescription,
  allPostsWithContent,
} from './readPosts';

export type {
  AllPostsWithMatter,
  AllPostsWithDescription,
  AllPostsWithContent,
} from './readPosts';

/**
 * Paging, get all posts length
 * @returns
 */
export function getAllPostNum() {
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
  postDatas: AllPostsWithDescription[];
}

export function getPagingData(start?: string) {
  const totalNum = allPostsWithDescription.length;
  const pagingSize = 10;
  const allPages = Math.ceil(totalNum / pagingSize);

  const startIndex = start ? (Number(start) - 1) * pagingSize : 0;

  const postDatas = allPostsWithDescription.slice(startIndex, startIndex + 10);

  return {
    totalNum,
    pagingSize,
    allPages,
    postDatas,
  };
}

export function getAllPostSlugs() {
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
  return allPostsWithMatter.map((post) => {
    return {
      params: {
        slug: post.url,
      },
    };
  });
}

export function getPostData(slug: string) {
  const post = allPostsWithContent.find((post) => post.url === slug)!;

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
export const getArchiveData = () => {
  const archiveData: {
    [key: string]: AllPostsWithMatter[];
  } = {};

  allPostsWithMatter.map((post) => {
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
