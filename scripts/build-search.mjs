import {config} from 'dotenv';
import algoliasearch from 'algoliasearch/lite.js';
import fs from 'fs';
import path from 'path';
import {nanoid} from 'nanoid';

/**
 * Build post information for Algolia search.
 * @param filename
 * @returns
 */
const postLists = () => {
  const files = fs.readdirSync(path.join('pages/p'));

  const myPosts = [];
  files.map((f) => {
    const content = fs.readFileSync(path.join('pages/p', f), 'utf-8');
    // const { data: meta, content } = matter(markdownWithMeta);

    const slug = f.replace(/\.mdx$/, '');
    const regex = /^#{2}(?!#)(.*)/gm;

    content.match(regex)?.map((h) => {
      const heading = h.substring(3);

      myPosts.push({
        content: null,
        hierarchy: {
          lvl0: 'Post',
          lvl1: slug,
          lvl2: heading,
        },
        type: 'lvl2',
        objectID: `${nanoid()}-https://rua.plus/p/${slug}`,
        url: `https://rua.plus/p/${slug}#${heading
          .toLocaleLowerCase()
          .replace(/ /g, '-')}`,
      });
    });

    myPosts.push({
      content: null,
      hierarchy: {
        lvl0: 'Post',
        lvl1: slug,
      },
      type: 'lvl1',
      objectID: `${nanoid()}-https://rua.plus/p/${slug}`,
      url: `https://rua.plus/p/${slug}`,
    });
  });
  return myPosts;
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
    const posts = postLists();

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

function test() {
  const posts = postLists();
  posts.map((p) => console.log(p));
}

// test();
main();
