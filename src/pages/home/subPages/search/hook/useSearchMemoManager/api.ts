import { errorResponse, validResponse } from 'pages/api/interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import {
  Memo,
  MemoSearchAnswerWithAI,
  MemoSearchAnswerWithDB,
  MemoSearchConversation,
} from 'pages/home/subPages/interfaces';
import { isValidResponse } from 'pages/api';
import { refreshableApi } from 'pages/home/api';
import { paginationData } from 'pages/home/subPages/api';

export interface SearchInit {
  id: string;
  query: string;
}
interface SearchInitResponse extends SearchInit, validResponse {}

export const searchMemo = async function (
  query: string
): Promise<SearchInitResponse | errorResponse> {
  const method = getMethodName();
  const endpoint = '/memos/search/history';

  try {
    const response = await refreshableApi.post(endpoint, JSON.stringify({ query }));
    const responseInfo = {
      method,
      status: response.status,
      id: response.data.id,
      query: response.data.query,
    } as SearchInitResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const searchMemoWithDB = async function (
  searchHistoryId: string
): Promise<searchMemoWithDBResponse | errorResponse> {
  const method = getMethodName();
  const endpoint = `/memos/search/db?searchHistoryId=${searchHistoryId}`;

  try {
    const response = await refreshableApi.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      loading: false,
      memos: response.data.memos,
    } as searchMemoWithDBResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const searchMemoWithAI = async function (
  searchHistoryId: string
): Promise<searchMemoWithAIResponse | errorResponse> {
  const method = getMethodName();
  const endpoint = `/memos/search/ai?searchHistoryId=${searchHistoryId}`;

  try {
    const response = await refreshableApi.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      loading: false,
      processed_message: response.data.processed_message,
      memos: response.data.memos,
    } as searchMemoWithAIResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

interface searchMemoWithDBResponse extends MemoSearchAnswerWithDB, validResponse {}

interface searchMemoWithAIResponse extends MemoSearchAnswerWithAI, validResponse {}

export interface cuMemoResponse extends Memo, validResponse {}

export interface paginationSearchHistories extends paginationData {
  search_histories: MemoSearchConversation[];
}

interface paginationSearchHistoriesResponse
  extends paginationSearchHistories,
    validResponse {}

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

export const isSearchInitResponse = (
  response: SearchInitResponse | errorResponse
): response is SearchInitResponse => {
  return (response as SearchInitResponse).id !== undefined;
};

export const isSearchMemoWithDBResponse = (
  response: searchMemoWithDBResponse | errorResponse
): response is searchMemoWithDBResponse => {
  return (response as searchMemoWithDBResponse).memos !== undefined;
};

export const isSearchMemoWithAIResponse = (
  response: searchMemoWithAIResponse | errorResponse
): response is searchMemoWithAIResponse => {
  return (response as searchMemoWithAIResponse).processed_message !== undefined;
};

export const isDeleteMemoResponse = (
  response: validResponse | errorResponse
): response is validResponse => {
  return isValidResponse(response);
};

export const isSearchHistoriesResponse = (
  response: paginationSearchHistoriesResponse | errorResponse
): response is paginationSearchHistoriesResponse => {
  return (
    (response as paginationSearchHistoriesResponse).search_histories !== undefined
  );
};
