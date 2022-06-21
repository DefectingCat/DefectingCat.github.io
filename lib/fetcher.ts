import { Base64 } from 'js-base64';
import { Gist, GithubUser, SignalGist } from 'types';

const baseUrl = 'https://api.github.com';
const username = 'DefectingCat';
const password = process.env.NEXT_PUBLIC_GITHUB_API;

const headers = new Headers();
headers.set(
  'Authorization',
  'Basic ' + Base64.encode(username + ':' + password)
);

/**
 * Get all gists.
 * @returns
 */
export const getGists = async (page = 1, perPage = 10) => {
  return (await fetch(`${baseUrl}/gists?per_page=${perPage}&page=${page}`, {
    headers,
  }).then((res) => res.json())) as Gist[];
};

/**
 * Get user information.
 * @returns
 */
export const getUser = async () => {
  return (await fetch(`${baseUrl}/user`, { headers }).then((res) =>
    res.json()
  )) as GithubUser;
};

/**
 * Get one gist.
 * @param id
 * @returns
 */
export const getSignalGist = async (id: string) => {
  return (await fetch(`${baseUrl}/gists/${id}`, { headers }).then((res) =>
    res.json()
  )) as SignalGist;
};
