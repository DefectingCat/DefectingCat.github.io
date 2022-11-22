/**
 * Generate algolia records.
 * @params -t for test.
 * @params -g add gitsts to records.
 */
/* @ts-check */
import { config } from 'dotenv';
import algoliasearch from 'algoliasearch/lite.js';
import generateGists from './gists/index.mjs';
import postLists from './posts/index.mjs';

async function generateRecords(gists) {
  const records = await postLists();
  return gists ? records.concat(await generateGists()) : records;
}
async function pushAlgolia(gists) {
  if (
    !process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
    !process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ADMIN_KEY
  ) {
    return console.log('API key not found!');
  }

  try {
    const records = await generateRecords(gists);

    // initialize the client with your environment variables
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ADMIN_KEY
    );

    // initialize the index with your index name
    const index = client.initIndex('RUA');

    // save the objects!
    const algoliaResponse = await index.replaceAllObjects(records);

    // check the output of the response in the console
    console.log(
      `🎉 Sucessfully added ${algoliaResponse.objectIDs.length} records to Algolia search.`
    );
  } catch (e) {
    console.log(e);
  }
}

async function test(gists) {
  const records = await generateRecords(gists);
  console.log(records);
}

function main() {
  // initialize environment variables
  config();

  const args = process.argv.slice(2);
  const isTest = args.some((arg) => arg === '-t');
  const gists = args.some((arg) => arg === '-g');

  isTest ? test(gists) : pushAlgolia(gists);
}

main();