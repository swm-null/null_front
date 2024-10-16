import {
  Memo,
  MemoSearchAnswer,
  MemoSearchConversation,
  Tag,
} from 'pages/home/subPages/interfaces';
import { errorResponse, validResponse } from '../interface';
import { errorHandler, getMethodName } from '../utils';
import { refreshableApi } from './_api';
import { SortOption } from 'pages/home/subPages/dashboard/interfaces';

interface searchMemoResponse extends MemoSearchAnswer, validResponse {}

export const searchMemo = async function (
  inputContent: string
): Promise<searchMemoResponse | errorResponse> {
  const method = getMethodName();
  const endpoint = '/memos/search';
  try {
    const response = await refreshableApi.post(
      endpoint,
      JSON.stringify({ content: inputContent })
    );
    const responseInfo = {
      method,
      status: response.status,
      processed_message: response.data.processed_message,
      memos: response.data.memos,
    } as searchMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

interface cuMemoResponse extends Memo, validResponse {}

export const createMemo = async (
  inputContent: string,
  inputImageUrls?: string[]
): Promise<cuMemoResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/memo`;
  try {
    const response = await refreshableApi.post(
      endpoint,
      JSON.stringify({
        content: inputContent,
        image_urls: inputImageUrls ? inputImageUrls : [],
      })
    );
    const { id, content, tags, image_urls, created_at, updated_at } =
      response.data.memo;
    const responseInfo = {
      method,
      status: response.status,
      id,
      content,
      tags,
      image_urls,
      created_at,
      updated_at,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const updateMemo = async (
  id: string,
  content: string
): Promise<cuMemoResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/memos/${id}`;
  const data = JSON.stringify({
    content: content,
  });
  try {
    const response = await refreshableApi.put(endpoint, data);
    const { id, content, tags, image_urls, created_at, updated_at } =
      response.data.memo;
    const responseInfo = {
      method,
      status: response.status,
      id,
      content,
      tags,
      image_urls,
      created_at,
      updated_at,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const deleteMemo = async (
  id: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/memos/${id}`;
  try {
    const response = await refreshableApi.delete(endpoint);
    const { id, content, tags, image_urls, created_at, updated_at } =
      response.data.memo;
    const responseInfo = {
      method,
      status: response.status,
      id,
      content,
      tags,
      image_urls,
      created_at,
      updated_at,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

interface paginationData {
  total_count: number;
  current_count: number;
  total_page: number;
  current_page: number;
}

interface paginationMemos extends paginationData {
  memos: Memo[];
}

interface paginationMemosWithTag extends paginationData {
  tag: Tag;
  memos: Memo[];
}

export interface paginationRecentMemosResponse
  extends paginationMemos,
    validResponse {}

export interface paginationMemosResponse
  extends paginationMemosWithTag,
    paginationData,
    validResponse {}

export const getRecentMemos = async (
  page: number,
  memoLimit: number
): Promise<paginationRecentMemosResponse | errorResponse> => {
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
    } as paginationRecentMemosResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export interface paginationDashboardResponse
  extends paginationData,
    validResponse {
  tag_with_memos: paginationMemosWithTag;
  child_tags_with_memos: paginationMemosWithTag[];
}

export const getDashboardDataByTag = async ({
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
}): Promise<paginationDashboardResponse | errorResponse> => {
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
    const responseInfo = {
      method,
      status: response.status,
      child_tags_with_memos: response.data.child_tags_with_memos,
      tag_with_memos: response.data.tag_with_memos,
      total_count: response.data.total_count,
      current_count: response.data.current_count,
      total_page: response.data.total_page,
      current_page: response.data.current_page,
    };
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const getChildTagSectionData = async ({
  tagId,
  memoPage,
  memoLimit,
  sortOrder,
}: {
  tagId?: string;
  memoPage: number;
  memoLimit: number;
  sortOrder: SortOption;
}): Promise<paginationMemosWithTag | errorResponse> => {
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
      tag: response.data.tag,
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

export interface paginationSearchHistoriesResponse extends paginationData {
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

export const isValidResponse = (
  response: validResponse | errorResponse
): response is validResponse => {
  const validStatus = [200, 201, 202, 203, 204, 205, 206];
  return validStatus.includes(response.status);
};

export const isRecentMemosResponse = (
  response: paginationRecentMemosResponse | errorResponse
): response is paginationRecentMemosResponse => {
  return (
    (response as paginationRecentMemosResponse).current_count !== undefined
  );
};

export const isSearchMemoResponse = (
  response: searchMemoResponse | errorResponse
): response is searchMemoResponse => {
  return (response as searchMemoResponse).processed_message !== undefined;
};

export const isCreateMemoResponse = (
  response: cuMemoResponse | errorResponse
): response is cuMemoResponse => {
  return (response as cuMemoResponse).content !== undefined;
};

export const isUpdateMemoResponse = (
  response: cuMemoResponse | errorResponse
): response is cuMemoResponse => {
  return (response as cuMemoResponse).content !== undefined;
};

export const isDeleteMemoResponse = (
  response: validResponse | errorResponse
): response is validResponse => {
  return isValidResponse(response);
};

export const isGetDashboardData = (
  response: paginationDashboardResponse | errorResponse
): response is paginationDashboardResponse => {
  return (response as paginationDashboardResponse).tag_with_memos !== undefined;
};

export const isGetSearchHistories = (
  response: paginationSearchHistoriesResponse | errorResponse
): response is paginationSearchHistoriesResponse => {
  return (
    (response as paginationSearchHistoriesResponse).search_histories !==
    undefined
  );
};

export const isGetChildTagSectionData = (
  response: paginationMemosWithTag | errorResponse
): response is paginationMemosWithTag => {
  return (response as paginationMemosWithTag).tag !== undefined;
};
