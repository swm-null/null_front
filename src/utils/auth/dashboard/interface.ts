import { Memo, Tag } from 'pages/home/contents/@interfaces';
import { validResponse } from 'utils/auth';

export interface getMemosResponse extends validResponse {
  memos: Memo[];
}

export interface getTagsResponse extends validResponse {
  tags: Tag[];
}
