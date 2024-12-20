import { validResponse } from 'pages/api/interface';
import { Memo } from '../interfaces';
import { errorResponse } from 'pages/api/interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import { refreshableApi } from 'pages/home/api';
import { SortOption } from 'pages/home/subPages/types';

export interface paginationData {
  total_count: number;
  current_count: number;
  total_page: number;
  current_page: number;
}

export interface paginationMemos extends paginationData {
  memos: Memo[];
}

export interface paginationMemosResponse extends paginationMemos, validResponse {}

export const getTagMemos = async ({
  tagId,
  page,
  limit,
  sortOrder,
  isLinked,
}: {
  tagId?: string;
  page: number;
  limit: number;
  sortOrder: SortOption;
  isLinked?: boolean;
}): Promise<paginationMemosResponse | errorResponse> => {
  const method = getMethodName();

  const params = new URLSearchParams();
  if (tagId) params.append('tagId', tagId);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (sortOrder) params.append('sortOrder', sortOrder);
  if (isLinked) params.append('isLinked', isLinked.toString());

  const endpoint = `/tag/memos?${params.toString()}`;

  try {
    const response = await refreshableApi.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      total_count: response.data.total_count,
      current_count: response.data.current_count,
      total_page: response.data.total_page,
      current_page: response.data.current_page,
      memos: response.data.memos,
    };
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const isMemosResponse = (
  response: paginationMemosResponse | errorResponse
): response is paginationMemosResponse => {
  return (response as paginationMemosResponse).current_count !== undefined;
};
