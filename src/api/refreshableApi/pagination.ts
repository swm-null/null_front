import * as Interface from 'pages/home/subPages/interfaces';
import { errorResponse, validResponse } from '../interface';
import { errorHandler, getMethodName } from '../utils';
import { refreshableApi } from './_api';
import { SortOption } from 'pages/home/subPages/dashboard/interfaces';

interface paginationData {
  total_count: number;
  current_count: number;
  total_page: number;
  current_page: number;
}

interface paginationMemos extends paginationData {
  memos: Interface.Memo[];
}

export interface paginationDashboardTagRelationsResponse
  extends paginationData,
    validResponse {
  tag: Interface.Tag;
  tag_relations: Interface.TagRelation[];
}

export interface paginationMemosResponse extends paginationMemos, validResponse {}

export const getRecentMemos = async (
  page: number,
  limit: number
): Promise<paginationMemosResponse | errorResponse> => {
  const method = getMethodName();

  try {
    const response = (await getTagMemos({
      page: page,
      limit: limit,
      sortOrder: 'LATEST',
    })) as paginationMemosResponse;
    response.method = method;
    return response;
  } catch (error) {
    return errorHandler(error, method);
  }
};

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

export const getDashboardTagRelations = async ({
  tagId,
  page,
  limit,
}: {
  tagId?: string;
  page: number;
  limit: number;
}): Promise<paginationDashboardTagRelationsResponse | errorResponse> => {
  const method = getMethodName();

  const params = new URLSearchParams();
  if (tagId) params.append('tagId', tagId);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const endpoint = `/childTags?${params.toString()}`;

  try {
    const response = await refreshableApi.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      total_count: response.data.total_count,
      current_count: response.data.current_count,
      total_page: response.data.total_page,
      current_page: response.data.current_page,
      tag: response.data.tag,
      tag_relations: response.data.child_tags,
    };
    return responseInfo as paginationDashboardTagRelationsResponse;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export interface paginationSearchHistoriesResponse
  extends paginationData,
    validResponse {
  search_histories: Interface.MemoSearchConversation[];
}

export const getSearchHistories = async ({
  query,
  page,
  limit,
}: {
  query?: string;
  page?: number;
  limit?: number;
}): Promise<paginationSearchHistoriesResponse | errorResponse> => {
  const method = getMethodName();

  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const endpoint = `/memos/search/histories?${params.toString()}`;

  try {
    const response = await refreshableApi.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      total_count: response.data.total_count,
      current_count: response.data.current_count,
      total_page: response.data.total_page,
      current_page: response.data.current_page,
      search_histories: response.data.search_histories,
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

export const isDashboardTagRelationsResponse = (
  response: paginationDashboardTagRelationsResponse | errorResponse
): response is paginationDashboardTagRelationsResponse => {
  return (
    (response as paginationDashboardTagRelationsResponse).tag_relations !== undefined
  );
};

export const isSearchHistoriesResponse = (
  response: paginationSearchHistoriesResponse | errorResponse
): response is paginationSearchHistoriesResponse => {
  return (
    (response as paginationSearchHistoriesResponse).search_histories !== undefined
  );
};