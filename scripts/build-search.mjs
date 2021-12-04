import { config } from 'dotenv';
import algoliasearch from 'algoliasearch/lite.js';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import strip from 'strip-markdown';

const postsDirectory = join(process.cwd(), 'public/posts');

/**
 * Get all sorted posts
 * @returns
 */
async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = await readdir(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');

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
        objectID: id,
        id,
        // Add post description
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

(async function () {
  // initialize environment variables
  config();

  if (
    !process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
    !process.env.ALGOLIA_SEARCH_ADMIN_KEY
  ) {
    return console.log('API key not found!');
  }

  try {
    const posts = await getSortedPostsData();

    // initialize the client with your environment variables
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.ALGOLIA_SEARCH_ADMIN_KEY
    );

    // initialize the index with your index name
    const index = client.initIndex('rua');

    // save the objects!
    const algoliaResponse = await index.replaceAllObjects(posts);

    // check the output of the response in the console
    console.log(
      `🎉 Sucessfully added ${
        algoliaResponse.objectIDs.length
      } records to Algolia search. Object IDs:\n${algoliaResponse.objectIDs.join(
        '\n'
      )}`
    );
  } catch (e) {
    console.log(e);
  }
})();
