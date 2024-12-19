import { validResponse } from 'pages/api/interface';
import { Memo } from 'pages/home/subPages/interfaces';

export interface cuMemoResponse extends Memo, validResponse {}
