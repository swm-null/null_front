import { errorResponse } from 'pages/api/interface';
import { cuMemoResponse } from '../interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import { refreshableApi } from 'pages/home/api';
import { Tag } from 'pages/home/subPages/interfaces';

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

export const isCreateMemoResponse = (
  response: cuMemoResponse | errorResponse
): response is cuMemoResponse => {
  return (response as cuMemoResponse).content !== undefined;
};
