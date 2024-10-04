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
    console.log(response);
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

export const isGetTagsResponse = (
  response: getTagsResponse | errorResponse
): response is getTagsResponse => {
  return (response as getTagsResponse).tags !== undefined;
};
