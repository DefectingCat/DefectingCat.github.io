import { Gist, GithubUser } from 'types';
import { Base64 } from 'js-base64';

const baseUrl = 'https://api.github.com/';
const username = 'DefectingCat';
const password = process.env.NEXT_PUBLIC_GITHUB_API;

const headers = new Headers();
headers.set(
  'Authorization',
  'Basic ' + Base64.encode(username + ':' + password)
);

/**
 * Get all gists
 * @returns
 */
export const getGists = async () => {
  return (await fetch(`${baseUrl}users/${username}/gists`, { headers }).then(
    (res) => res.json()
  )) as Gist[];
};

/**
 * Get user information.
 * @returns
 */
export const getUser = async () => {
  return (await fetch(`${baseUrl}user`, { headers }).then((res) =>
    res.json()
  )) as GithubUser;
};
