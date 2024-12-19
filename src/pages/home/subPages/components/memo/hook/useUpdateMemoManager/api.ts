import { errorHandler, getMethodName } from 'pages/api/utils';
import { cuMemoResponse } from '../interface';
import { errorResponse } from 'pages/api/interface';
import { refreshableApi } from 'pages/home/api';

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

export const isUpdateMemoResponse = (
  response: cuMemoResponse | errorResponse
): response is cuMemoResponse => {
  return (response as cuMemoResponse).content !== undefined;
};
