import { algoliasearch } from 'algoliasearch';
/**
 * Generate algolia records.
 * @params -t for test.
 */
/* @ts-check */
// import { liteClient } from 'algoliasearch/lite';
// import generateGists from './gists/index.mjs';
import { config } from 'dotenv';
import postLists from './posts/index.mjs';

async function generateRecords() {
  return postLists();
}
async function pushAlgolia() {
  if (
    !process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
    !process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ADMIN_KEY
  ) {
    return console.log('API key not found!');
  }

  try {
    const records = await generateRecords();

    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ADMIN_KEY,
    );

    const response = await client.clearObjects({ indexName: 'rua' });
    console.log('Clean rua index success', response);
    const algoliaResponse = await client.saveObjects({
      indexName: 'rua',
      objects: records,
    });

    console.log(algoliaResponse);
    console.log(
      `🎉 Sucessfully added ${algoliaResponse[0].objectIDs.length} records to Algolia search.`,
    );
  } catch (e) {
    console.log(e);
  }
}

async function test() {
  const records = await generateRecords();
  console.log(records);
}

function main() {
  // initialize environment variables
  config();

  const args = process.argv.slice(2);
  const isTest = args.some((arg) => arg === '-t');

  isTest ? test() : pushAlgolia();
}

main();
