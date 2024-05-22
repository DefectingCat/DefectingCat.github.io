/* @ts-check */
import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';

/**
 * Get gists.
 * @param {number} page
 * @param {number} perPage
 * @returns
 */
async function getGists(page, perPage) {
  const password = process.env.NEXT_PUBLIC_GITHUB_API;
  const host = process.env.NEXT_PUBLIC_GISTS_HOST ?? 'http://api.github.com';
  const MyOctokit = Octokit.plugin(restEndpointMethods);
  const octokit = new MyOctokit({
    auth: password,
    baseUrl: host,
  });
  return await octokit.rest.gists.list({
    page,
    per_page: perPage,
  });
}

async function generateRecords(gists, result) {
  const pushGist = (d) => {
    const url = `https://rua.plus/g/${d.id}`;
    const files = d.files;
    const record = {
      content: null,
      hierarchy: {
        lvl0: 'Gist',
        lvl1: d.description,
      },
      type: `lvl1`,
      objectID: url,
      url,
    };
    gists.push(record);
    Object.keys(files).map((key) => {
      gists.push({
        ...record,
        hierarchy: {
          ...record.hierarchy,
          lvl2: files[key].filename,
        },
        type: 'lvl2',
      });
    });
  };
  result.data.map(pushGist);
}

/**
 * Generate all gists search records.
 */
async function generateGists() {
  const linkMatch = /<(.*?)>/;
  const relMatch = /"(.*?)"/;
  const perPage = 50;

  const result = await getGists(1, perPage);
  const link = result.headers.link?.split(',');
  const pageSize = {
    prev: null,
    next: null,
    last: null,
    first: null,
  };
  link.map((l) => {
    const text = l.match(relMatch)?.[1];
    if (!text) return;
    const page = new URLSearchParams(l.match(linkMatch)?.[1].split('?')[1]).get(
      'page',
    );
    pageSize[text] = Number(page);
  });
  const gists = [];
  generateRecords(gists, result);

  for (let i = pageSize.next; i <= pageSize.last; i++) {
    generateRecords(gists, await getGists(i, perPage));
  }

  return gists;
}

export default generateGists;
