import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import markdownToTxt from 'markdown-to-txt';

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

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Process markdown to plain text
    const contentText = markdownToTxt(matterResult.content);

    // Combine the data with the id
    return {
      id,
      // Add post description
      desc: `${contentText.slice(0, 100)}...`,
      ...({
        ...matterResult.data,
        date: matterResult.data.date.toISOString(),
      } as MyMatters),
    };
  });

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

  // Convert Date to locale string.
  // return allPostsData.map((post) => {
  //   if (typeof post.date == 'object') post.date = post.date.toISOString();
  //   return post;
  // });
}

// Paging, get all posts length
export function getAllPostNum() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);

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
  let i = 1;
  return fileNames.map(() => {
    i++;
    return {
      params: {
        num: i.toString(),
      },
    };
  });
}

export function getPagingData(allPostsData: AllPostsData[], start?: string) {
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

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);

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
  return fileNames.map((fileName) => {
    const allPostsData = getSortedPostsData();
    const slug = allPostsData.find(
      (item) => item.id === fileName.replace(/\.md$/, '')
    );

    return {
      params: {
        slug: slug?.url,
      },
    };
  });
}

export interface MyPost extends AllPostsData {
  contentHtml: string;
}

export async function getPostData(slug: string) {
  const allPostsData = getSortedPostsData();
  const post = allPostsData.find((item) => item.url === slug);

  const fullPath = path.join(postsDirectory, `${post?.id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Process markdown to html
  // const processedContent = await remark()
  //   .use(html({ sanitize: false }))
  //   .process(matterResult.content);
  // const contentHtml = processedContent.toString();

  // Combine the data with the id
  return {
    id: slug,
    // contentHtml,
    content: matterResult.content,
    // Convert Date to locale string.
    ...({
      ...matterResult.data,
      date: matterResult.data.date.toISOString(),
    } as MyMatters),
  };
}
