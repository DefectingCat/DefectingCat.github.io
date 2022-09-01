/* @ts-check */
import { config } from 'dotenv';
import algoliasearch from 'algoliasearch/lite.js';
import fs from 'fs';
import path from 'path';

const dataPath = 'data/posts';

/**
 * Build post information for Algolia search.
 * @param filename
 * @returns
 */
const postLists = () => {
  const files = fs.readdirSync(path.join(dataPath));

  const myPosts = [];
  files.map((f) => {
    const content = fs.readFileSync(path.join(dataPath, f), 'utf-8');
    // const { data: meta, content } = matter(markdownWithMeta);

    const slug = f.replace(/\.mdx$/, '');
    const regex = /^#{2,3}(?!#)(.*)/gm;

    let lastH2 = '';
    const url = `https://rua.plus/p/${slug}#${head
      .toLocaleLowerCase()
      .replace(/ /g, '-')}`;

    content.match(regex)?.map((h) => {
      const heading = h.split(' ');
      const level = heading[0].length;
      const head = h.substring(level + 1);
      const record = {
        content: null,
        hierarchy: {
          lvl0: 'Post',
          lvl1: slug,
          lvl2: head,
        },
        type: `lvl${level}`,
        objectID: url,
        url,
      };

      switch (level) {
        case 2: {
          myPosts.push(record);
          lastH2 = head;
          break;
        }
        case 3: {
          myPosts.push({
            ...record,
            hierarchy: {
              ...record.hierarchy,
              lvl3: h.substring(level + 1),
            },
          });
          break;
        }
      }
    });

    myPosts.push({
      content: null,
      hierarchy: {
        lvl0: 'Post',
        lvl1: slug,
      },
      type: 'lvl1',
      objectID: url,
      url,
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
