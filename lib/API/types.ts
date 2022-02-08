export interface SearchType {
  page: number;
  result: SearchResult[];
  hasNext: boolean;
  totalPage: number;
  message: string;
}
export interface SearchResult {
  id: string;
  title: string;
  date: string;
  url: string;
  desc: string;
}
