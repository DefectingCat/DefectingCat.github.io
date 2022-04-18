import { config } from 'dotenv';
import algoliasearch from 'algoliasearch/lite.js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const sortByDate = ({ date: a }, { date: b }) => {
  if (a < b) {
    return 1;
  } else if (a > b) {
    return -1;
  } else {
    return 0;
  }
};

/**
 * Read post meta info with gray-matter.
 * @param filename
 * @returns
 */
const readFileMeta = (filename) => {
  const markdownWithMeta = fs.readFileSync(
    path.join('pages/p', filename),
    'utf-8'
  );
  const slug = filename.replace(/\.mdx$/, '');
  const { data: meta } = matter(markdownWithMeta);
  return {
    slug,
    ...{ ...meta },
  };
};

/**
 * Read all posts with matter info.
 * @returns
 */
export const postLists = async () => {
  const files = fs.readdirSync(path.join('pages/p'));
  const posts = files.map(readFileMeta).sort(sortByDate);

  return posts;
};

async function main() {
  // initialize environment variables
  config();

  if (
    !process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
    !process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ADMIN_KEY
  ) {
    return console.log('API key not found!');
  }

  try {
    const posts = await postLists();
    // All objects must have an unique objectID
    posts.forEach((p) => (p.objectID = p.slug));

    // initialize the client with your environment variables
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ADMIN_KEY
    );

    // initialize the index with your index name
    const index = client.initIndex('RUA');

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
}

// (async () => {
//   const posts = await postLists();
//   console.log(posts);
// })();

main();
