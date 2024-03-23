import { Octokit } from 'octokit';
import { cache } from 'react';
import { GistData, GistsFile, PageKeys, PageSize } from 'types';

const password = process.env.NEXT_PUBLIC_GITHUB_API;
const host = process.env.NEXT_PUBLIC_GISTS_HOST ?? 'https://api.github.com';

if (!password) throw new Error('No GitHub token detected.');
const octokit = new Octokit({
  auth: password,
  baseUrl: host,
});

const linkMatch = /<(.*?)>/;
const relMatch = /"(.*?)"/;

/**
 * Get all gists.
 * @returns
 */
export const getGists = cache(async (page = 1, perPage = 10) => {
  const result = await octokit.rest.gists.list({
    page,
    per_page: perPage,
  });
  /**
   *
   * <https://api.github.com/gists?page=1&per_page=1>; rel="prev",
   * <https://api.github.com/gists?page=3&per_page=1>; rel="next",
   * <https://api.github.com/gists?page=40&per_page=1>; rel="last",
   * <https://api.github.com/gists?page=1&per_page=1>; rel="first"
   */
  const link = result.headers.link?.split(',');

  if (!link) return null;

  const pageSize: PageSize = {
    prev: null,
    next: null,
    last: null,
    first: null,
  };
  link.map((l) => {
    const text = l.match(relMatch)?.[1] as PageKeys;
    if (!text) return;
    pageSize[text] = new URLSearchParams(
      l.match(linkMatch)?.[1].split('?')[1],
    ).get('page');
  });

  const data: GistData[] = result.data.map((item) => ({
    id: item.id,
    files: item.files,
    login: item.owner?.login ?? '',
    updated_at: item.updated_at,
    description: item.description,
  }));

  await Promise.all(
    data.map(async (g) => {
      await Promise.all(
        Object.keys(g.files).map(async (f) => {
          const url = g.files[f]?.raw_url;
          if (!url) return;
          try {
            g.files[f]!.content = await fetch(url).then((res) => res.text());
          } catch (err) {
            console.log(err);
          }
        }),
      );
    }),
  );

  return {
    pageSize,
    gists: data,
  };
});

export type GetUser = Awaited<ReturnType<typeof getUser>>;
/**
 * Get user information.
 * @returns
 */
export const getUser = cache(async () => {
  return (await octokit.rest.users.getAuthenticated()).data;
});

export type GetSignalGist = Awaited<ReturnType<typeof getSignalGist>>;
export type SingalGist = {
  login: string | undefined;
  files: { [key: string]: GistsFile };
  updated_at: string | undefined;
  description: string | undefined | null;
};
/**
 * Get one gist.
 * @param id
 * @returns
 */
export const getSignalGist = cache(async (id: string) => {
  const result = (
    await octokit.rest.gists.get({
      gist_id: id,
    })
  ).data;

  if (result.files == null) return;

  const data: SingalGist = {
    login: result.owner?.login,
    updated_at: result.updated_at,
    description: result.description,
    files: result.files as SingalGist['files'],
  };

  await Promise.all(
    Object.keys(data.files).map(async (f) => {
      const url = data.files?.[f]?.raw_url;
      if (!url) return;
      let target = data.files[f];
      if (!target?.content)
        target = {
          ...target,
          content: '',
        };
      target.content = await fetch(url).then((res) => res.text());
    }),
  );

  return data;
});

export interface LinkResult {
  meta: Meta;
  links: Link[];
  rel: [];
}
export interface Link {
  href: string;
  rel: string[];
  type: string;
}
export interface Meta {
  description: string;
  title: string;
  author: string;
  canonical: string;
}
const defaultLinkResult: LinkResult = {
  meta: {
    description: '',
    title: '',
    author: '',
    canonical: '',
  },
  links: [],
  rel: [],
};
export const urlMeta = cache(async (url: string) => {
  try {
    const result: LinkResult = await (
      await fetch(`http://iframely.server.crestify.com/iframely?url=${url}`)
    ).json();
    return result;
  } catch (err) {
    console.error(err);
    return defaultLinkResult;
  }
});
