import {
  Memo,
  MemoSearchConversation,
  Tag,
  TagRelation,
} from 'pages/home/subPages/interfaces';
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
  memos: Memo[];
}

export interface paginationTagRelationResponse
  extends paginationData,
    validResponse {
  tag_relations: TagRelation[];
}

export interface paginationMemosResponse
  extends paginationMemos,
    validResponse {}

export const getRecentMemos = async (
  page: number,
  memoLimit: number
): Promise<paginationMemosResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/tag/memos?memoPage=${page}&memoLimit=${memoLimit}&sortOrder=LATEST`;

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
    } as paginationMemosResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

// FIXME: be 코드 바뀌면 없애기
export interface paginationDashboardResponse
  extends paginationData,
    validResponse {
  tag_with_memos: { tag: Tag; child_tags: Tag[] } & paginationMemos;
  child_tags_with_memos: ({ tag: Tag; child_tags: Tag[] } & paginationMemos)[];
}

export const getDashboardTagRelation = async ({
  parentTagId,
  tagPage,
  tagLimit,
  memoLimit,
  sortOrder,
}: {
  parentTagId?: string;
  tagPage: number;
  tagLimit: number;
  memoLimit: number;
  sortOrder: SortOption;
}): Promise<paginationTagRelationResponse | errorResponse> => {
  const method = getMethodName();

  const params = new URLSearchParams();
  if (parentTagId) params.append('parentTagId', parentTagId);
  if (tagPage) params.append('tagPage', tagPage.toString());
  if (tagLimit) params.append('tagLimit', tagLimit.toString());
  if (memoLimit) params.append('memoLimit', memoLimit.toString());
  if (sortOrder) params.append('sortOrder', sortOrder);

  const endpoint = `/childTags/memos?${params.toString()}`;

  try {
    const response = await refreshableApi.get(endpoint);
    // FIXME: be 코드 바뀌면 없애기
    const tempResponseInfo = {
      method,
      status: response.status,
      child_tags_with_memos: response.data.child_tags_with_memos,
      tag_with_memos: response.data.tag_with_memos,
      total_count: response.data.total_count,
      current_count: response.data.current_count,
      total_page: response.data.total_page,
      current_page: response.data.current_page,
    } as paginationDashboardResponse;

    const responseInfo = {
      ...tempResponseInfo,
      tag_relations: tempResponseInfo.child_tags_with_memos.map(
        (child_tag_with_memos) => ({
          tag: child_tag_with_memos.tag,
          child_tags: child_tag_with_memos.child_tags,
        })
      ),
    };
    return responseInfo as paginationTagRelationResponse;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const getDashboardSectionData = async ({
  tagId,
  memoPage,
  memoLimit,
  sortOrder,
}: {
  tagId?: string;
  memoPage: number;
  memoLimit: number;
  sortOrder: SortOption;
}): Promise<paginationMemosResponse | errorResponse> => {
  const method = getMethodName();

  const params = new URLSearchParams();
  if (tagId) params.append('tagId', tagId);
  if (memoPage) params.append('memoPage', memoPage.toString());
  if (memoLimit) params.append('memoLimit', memoLimit.toString());
  if (sortOrder) params.append('sortOrder', sortOrder);

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

export interface paginationSearchHistoriesResponse
  extends paginationData,
    validResponse {
  search_histories: MemoSearchConversation[];
}

export const getSearchHistories = async ({
  query,
  searchHistoryPage,
  searchHistoryLimit,
}: {
  query?: string;
  searchHistoryPage?: number;
  searchHistoryLimit?: number;
}): Promise<paginationSearchHistoriesResponse | errorResponse> => {
  const method = getMethodName();

  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (searchHistoryPage)
    params.append('searchHistoryPage', searchHistoryPage.toString());
  if (searchHistoryLimit)
    params.append('searchHistoryLimit', searchHistoryLimit.toString());

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

export const isDashboardTagRelationResponse = (
  response: paginationTagRelationResponse | errorResponse
): response is paginationTagRelationResponse => {
  return (
    (response as paginationTagRelationResponse).tag_relations !== undefined
  );
};

export const isSearchHistoriesResponse = (
  response: paginationSearchHistoriesResponse | errorResponse
): response is paginationSearchHistoriesResponse => {
  return (
    (response as paginationSearchHistoriesResponse).search_histories !==
    undefined
  );
};
