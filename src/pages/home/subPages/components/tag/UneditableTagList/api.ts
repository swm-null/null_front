import { errorResponse, validResponse } from 'pages/api/interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import { refreshableApi } from 'pages/home/api';
import { Tag } from 'pages/home/subPages/interfaces';

interface getTagsResponse extends validResponse {
  tags: Tag[];
}

export const getAncestorTags = async (
  tagId: string
): Promise<getTagsResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/tag/ancestors?id=${tagId}`;

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

export const isGetTagsResponse = (
  response: getTagsResponse | errorResponse
): response is getTagsResponse => {
  return (response as getTagsResponse).tags !== undefined;
};
