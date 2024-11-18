import {
  Memo,
  MemoSearchAnswerWithDB,
  MemoSearchAnswerWithAI,
  Tag,
} from 'pages/home/subPages/interfaces';
import { errorResponse, validResponse } from '../interface';
import { errorHandler, getMethodName } from '../utils';
import { refreshableApi } from './_api';
import { isValidResponse } from 'api';

interface searchMemoWithDBResponse extends MemoSearchAnswerWithDB, validResponse {}

interface searchMemoWithAIResponse extends MemoSearchAnswerWithAI, validResponse {}

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

interface cuMemoResponse extends Memo, validResponse {}

export const createMemo = async (
  inputContent: string,
  inputImageUrls?: string[] | null,
  inputVoiceUrls?: string[] | null
): Promise<cuMemoResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/memo`;
  try {
    const response = await refreshableApi.post(
      endpoint,
      JSON.stringify({
        content: inputContent,
        image_urls: inputImageUrls ? inputImageUrls : [],
        voice_urls: inputVoiceUrls ? inputVoiceUrls : [],
      })
    );
    const responseInfo = {
      method,
      status: response.status,
      id: response.data.memo.id,
      content: response.data.memo.content,
      tags: response.data.memo.tags,
      image_urls: response.data.memo.image_urls,
      voice_urls: response.data.memo.voice_urls,
      metadata: response.data.memo.metadata,
      created_at: response.data.memo.created_at,
      updated_at: response.data.memo.updated_at,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const createLinkedMemo = async (
  tag: Tag,
  inputContent: string,
  inputImageUrls?: string[] | null,
  inputVoiceUrls?: string[] | null
): Promise<cuMemoResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/linkedMemo?tagId=${tag.id}`;
  try {
    const response = await refreshableApi.post(
      endpoint,
      JSON.stringify({
        content: inputContent,
        image_urls: inputImageUrls ? inputImageUrls : [],
        voice_urls: inputVoiceUrls ? inputVoiceUrls : [],
      })
    );
    const responseInfo = {
      method,
      status: response.status,
      id: response.data.memo.id,
      content: response.data.memo.content,
      tags: response.data.memo.tags,
      image_urls: response.data.memo.image_urls,
      voice_urls: response.data.memo.voice_urls,
      metadata: response.data.memo.metadata,
      created_at: response.data.memo.created_at,
      updated_at: response.data.memo.updated_at,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const createMemos = async (
  fileUrl: string,
  email: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/memos`;
  try {
    const response = await refreshableApi.post(
      endpoint,
      JSON.stringify({
        file_url: fileUrl,
        email,
      })
    );
    const responseInfo = {
      method,
      status: response.status,
    } as validResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const updateMemo = async (
  id: string,
  content: string,
  imageUrls?: string[] | null,
  voiceUrls?: string[] | null
): Promise<cuMemoResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/memo/${id}`;
  const data = JSON.stringify({
    content: content,
    image_urls: imageUrls ? imageUrls : [],
    voice_urls: voiceUrls ? voiceUrls : [],
  });
  try {
    const response = await refreshableApi.put(endpoint, data);
    const responseInfo = {
      method,
      status: response.status,
      id: response.data.memo.id,
      content: response.data.memo.content,
      tags: response.data.memo.tags,
      image_urls: response.data.memo.image_urls,
      voice_urls: response.data.memo.voice_urls,
      metadata: response.data.memo.metadata,
      created_at: response.data.memo.created_at,
      updated_at: response.data.memo.updated_at,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const updateMemoWithNewTags = async (
  id: string,
  content: string,
  imageUrls?: string[] | null,
  voiceUrls?: string[] | null
): Promise<cuMemoResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/memo/${id}/tags`;
  const data = JSON.stringify({
    content: content,
    image_urls: imageUrls ? imageUrls : [],
    voice_urls: voiceUrls ? voiceUrls : [],
  });
  try {
    const response = await refreshableApi.put(endpoint, data);
    const responseInfo = {
      method,
      status: response.status,
      id: response.data.memo.id,
      content: response.data.memo.content,
      tags: response.data.memo.tags,
      image_urls: response.data.memo.image_urls,
      voice_urls: response.data.memo.voice_urls,
      metadata: response.data.memo.metadata,
      created_at: response.data.memo.created_at,
      updated_at: response.data.memo.updated_at,
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
  const endpoint = `/memo/${id}`;
  try {
    const response = await refreshableApi.delete(endpoint);
    const responseInfo = {
      method,
      status: response.status,
    } as cuMemoResponse;
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
