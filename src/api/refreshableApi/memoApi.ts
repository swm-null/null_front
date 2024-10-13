import {
  Memo,
  MemoSearchAnswer,
  MemoSearchConversation,
  Tag,
} from 'pages/home/subPages/interfaces';
import { errorResponse, validResponse } from '../interface';
import { errorHandler, API_BASE_URL, getMethodName } from '../utils';
import { refreshableApi } from './_api';

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
      processedMessage: response.data.processed_message,
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
  const endpoint = `${API_BASE_URL}/memo`;
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

interface getMemosResponse extends validResponse {
  memos: Memo[];
}

interface paginationData {
  totalCount: number;
  currentCount: number;
  totalPage: number;
  currentPage: number;
}

interface paginationMemos extends paginationData {
  memos: Memo[];
}

export interface paginationMemosResponse
  extends paginationMemos,
    paginationData,
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
      totalCount: response.data.total_count,
      currentCount: response.data.current_count,
      totalPage: response.data.total_page,
      currentPage: response.data.current_page,
      memos: response.data.memos,
    } as paginationMemosResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export interface paginationDashboardResponse
  extends paginationData,
    validResponse {
  tagWithMemos: { tag: Tag } & paginationMemos;
  childTagsWithMemos: ({ tag: Tag } & paginationMemos)[];
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
  sortOrder: 'LATEST' | 'OLDEST';
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
      childTagsWithMemos: response.data.child_tags_with_memos,
      tagWithMemos: response.data.tag_with_memos,
      totalCount: response.data.total_count,
      currentCount: response.data.current_count,
      totalPage: response.data.total_page,
      current_page: response.data.current_page,
    };
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export interface paginationSearchHistoriesResponse extends paginationData {
  searchHistories: MemoSearchConversation[];
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
      totalCount: response.data.totalCount,
      currentCount: response.data.currentCount,
      totalPage: response.data.totalPage,
      currentPage: response.data.currentPage,
      searchHistories: response.data.searchHistories,
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

export const isPaginationMemosResponse = (
  response: paginationMemosResponse | errorResponse
): response is paginationMemosResponse => {
  return (response as paginationMemosResponse).currentCount !== undefined;
};

export const isSearchMemoResponse = (
  response: searchMemoResponse | errorResponse
): response is searchMemoResponse => {
  return (response as searchMemoResponse).processedMessage !== undefined;
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

export const isGetMemosResponse = (
  response: getMemosResponse | errorResponse
): response is getMemosResponse => {
  return isValidResponse(response as getMemosResponse);
};

export const isGetDashboardData = (
  response: paginationDashboardResponse | errorResponse
): response is paginationDashboardResponse => {
  return (response as paginationDashboardResponse).tagWithMemos !== undefined;
};

export const isGetSearchHistories = (
  response: paginationSearchHistoriesResponse | errorResponse
): response is paginationSearchHistoriesResponse => {
  return (
    (response as paginationSearchHistoriesResponse).searchHistories !==
    undefined
  );
};
