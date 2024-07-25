import { Memo, MemoSearchAnswer } from 'pages/home/contents/@interfaces';
import { validResponse } from 'utils/auth';

// Create, Update Memo Response
export interface cuMemoResponse extends Memo, validResponse {}

export interface searchMemoResponse extends MemoSearchAnswer, validResponse {}
