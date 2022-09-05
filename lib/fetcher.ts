import { Octokit } from 'octokit';
import { GistsFile } from 'types';

const password = process.env.NEXT_PUBLIC_GITHUB_API;
const host = process.env.NEXT_PUBLIC_GISTS_HOST ?? 'http://api.github.com';
const octokit = new Octokit({
  auth: password,
  baseUrl: host,
});

const linkMatch = /<(.*?)>/;
const relMatch = /"(.*?)"/;

export type GistData = {
  id: string;
  files: { [key: string]: GistsFile };
  login: string;
  updated_at: string;
  description: string | null;
};
export type GetGists = {
  /**
   * { prev: null, next: '2', last: '5', first: null }
   */
  pageSize: pageSize;
  gists: GistData[];
};
export type pageSize = { [key in PageKeys]: string | null };
export type PageKeys = 'prev' | 'next' | 'last' | 'first';

/**
 * Get all gists.
 * @returns
 */
export const getGists = async (page = 1, perPage = 10) => {
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

  const pageSize: pageSize = {
    prev: null,
    next: null,
    last: null,
    first: null,
  };
  link.map((l) => {
    const text = l.match(relMatch)?.[1] as PageKeys;
    if (!text) return;
    pageSize[text] = new URLSearchParams(
      l.match(linkMatch)?.[1].split('?')[1]
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
          const url = g.files[f].raw_url;
          if (!url) return;
          g.files[f].content = await fetch(url).then((res) => res.text());
        })
      );
    })
  );

  return {
    pageSize,
    gists: data,
  };
};

export type GetUser = Awaited<ReturnType<typeof getUser>>;
/**
 * Get user information.
 * @returns
 */
export const getUser = async () => {
  return (await octokit.rest.users.getAuthenticated()).data;
};

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
export const getSignalGist = async (id: string) => {
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
    })
  );

  return data;
};
