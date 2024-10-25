import { Tag } from 'pages/home/subPages/interfaces';
import { errorResponse, validResponse } from '../interface';
import { errorHandler, getMethodName } from '../utils';
import { refreshableApi } from './_api';

interface getTagsResponse extends validResponse {
  tags: Tag[];
}

export const getChildTags = async (
  tagId: string
): Promise<getTagsResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/childTags?parentTagId=${tagId}`;

  try {
    const response = await refreshableApi.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      message: '특정 태그의 자식 태그를 가져오는 것을 성공했습니다.',
      tags: response.data,
    };
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const getRootTags = async (): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = '/childTags';

  try {
    const response = await refreshableApi.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      tags: response.data,
    };
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

interface getTagResponse extends validResponse {
  tag: Tag;
}

export const editTag = async (
  tagId: string,
  tagNewName: string
): Promise<getTagResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/tag/${tagId}`;

  try {
    const response = await refreshableApi.put(
      endpoint,
      JSON.stringify({ name: tagNewName })
    );
    const responseInfo = {
      method,
      status: response.status,
      tag: response.data.tag,
    };
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const deleteTag = async (
  tagId: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/tag/${tagId}`;

  try {
    const response = await refreshableApi.delete(endpoint);
    const responseInfo = {
      method,
      status: response.status,
    };
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const isGetTagsResponse = (
  response: getTagsResponse | errorResponse
): response is getTagsResponse => {
  return (response as getTagsResponse).tags !== undefined;
};

export const isGetTagResponse = (
  response: getTagResponse | errorResponse
): response is getTagResponse => {
  return (response as getTagResponse).tag !== undefined;
};
