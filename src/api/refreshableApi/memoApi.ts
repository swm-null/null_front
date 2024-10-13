import { Memo, MemoSearchAnswer, Tag } from 'pages/home/subPages/interfaces';
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
      text: response.data.processed_message,
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
  total_count: number;
  current_count: number;
  total_page: number;
  current_page: number;
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

export interface paginationDashboardResponse
  extends paginationData,
    validResponse {
  tag_with_memos: { tag: Tag } & paginationMemos;
  child_tags_with_memos: ({ tag: Tag } & paginationMemos)[];
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
  const endpoint = `/childTags/memos?${parentTagId ? `parentTagId=${parentTagId}` : ''}&tagPage=${tagPage}&tagLimit=${tagLimit}&memoLimit=${memoLimit}&sortOrder=${sortOrder}`;

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

export const isValidResponse = (
  response: validResponse | errorResponse
): response is validResponse => {
  const validStatus = [200, 201, 202, 203, 204, 205, 206];
  return validStatus.includes(response.status);
};

export const isPaginationMemosResponse = (
  response: paginationMemosResponse | errorResponse
): response is paginationMemosResponse => {
  return (response as paginationMemosResponse).current_count !== undefined;
};

export const isSearchMemoResponse = (
  response: searchMemoResponse | errorResponse
): response is searchMemoResponse => {
  return (response as searchMemoResponse).text !== undefined;
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

export const isGetDashboardDataByTag = (
  response: paginationDashboardResponse | errorResponse
): response is paginationDashboardResponse => {
  return (response as paginationDashboardResponse).current_count !== undefined;
};
