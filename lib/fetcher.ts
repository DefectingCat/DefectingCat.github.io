import { Octokit } from 'octokit';
import { GistsFile } from 'types';

const password = process.env.NEXT_PUBLIC_GITHUB_API;
const octokit = new Octokit({
  auth: password,
});

const linkMatch = /<(.*?)>/;
// const relMatch = /"(.*?)"/;

export type GistData = {
  id: string;
  files: { [key: string]: GistsFile };
  login: string;
  updated_at: string;
  description: string | null;
};
export type GetGists = {
  next: string | null;
  total: string | null;
  gists: GistData[];
};

/**
 * Get all gists.
 * @returns
 */
export const getGists = async (page = 1, perPage = 10) => {
  const result = await octokit.rest.gists.list({
    page,
    per_page: perPage,
  });
  const link = result.headers.link?.split(',');

  if (!link) return null;
  const next = new URLSearchParams(
    link[0].match(linkMatch)?.[1].split('?')[1]
  ).get('page');
  const total = new URLSearchParams(
    link[1].match(linkMatch)?.[1].split('?')[1]
  ).get('page');

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
    next,
    total,
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

/**
 * Get one gist.
 * @param id
 * @returns
 */
export const getSignalGist = async (id: string) => {
  return (
    await octokit.rest.gists.get({
      gist_id: id,
    })
  ).data;
};
