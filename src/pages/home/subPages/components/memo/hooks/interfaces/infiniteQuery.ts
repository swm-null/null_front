import { Memo } from 'pages/home/subPages/interfaces';

export interface InfiniteQueryData {
  pages: MemoData[];
  pageParams: number[];
}

export interface MemoData {
  current_count: number;
  current_page: number;
  memos: Memo[];
}
