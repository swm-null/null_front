import { errorResponse, validResponse } from 'pages/api/interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import { refreshableApi } from 'pages/home/api';
import { Tag } from 'pages/home/subPages/interfaces';

interface getTagResponse extends validResponse {
  tag: Tag;
}

export const createTag = async (
  parentTag: Tag | null,
  tagName: string
): Promise<getTagResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/childTag${parentTag ? `?tagId=${parentTag.id}` : ''}`;

  try {
    const response = await refreshableApi.post(
      endpoint,
      JSON.stringify({ name: tagName })
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

export const isGetTagResponse = (
  response: getTagResponse | errorResponse
): response is getTagResponse => {
  return (response as getTagResponse).tag !== undefined;
};
