export interface MyMatters {
  title: string;
  date: string;
  tags: string[] | string;
}

export interface Post extends MyMatters {
  slug: string;
}

// Generated by https://quicktype.io
// export interface Gist {
//   url: string;
//   forks_url: string;
//   commits_url: string;
//   id: string;
//   node_id: string;
//   git_pull_url: string;
//   git_push_url: string;
//   html_url: string;
//   files: { [key: string]: GistsFile };
//   public: boolean;
//   created_at: string;
//   updated_at: string;
//   description: string;
//   comments: number;
//   user: null;
//   comments_url: string;
//   owner: GistsOwner;
//   truncated: boolean;
// }

export interface GistsFile {
  filename?: string | undefined;
  type?: string | undefined;
  language?: string | undefined;
  raw_url?: string | undefined;
  size?: number | undefined;
  content?: string | undefined;
}

export interface SignalGist extends GistData {
  forks: any[];
  history: History[];
}

export type GistData = {
  id: string;
  files: { [key: string]: GistsFile | undefined };
  login: string;
  updated_at: string;
  description: string | null;
};
export type GetGists = {
  /**
   * { prev: null, next: '2', last: '5', first: null }
   */
  pageSize: PageSize;
  gists: GistData[];
};
export type PageSize = { [key in PageKeys]: string | null };
export type PageKeys = 'prev' | 'next' | 'last' | 'first';
