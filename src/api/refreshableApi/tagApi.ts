import axios from 'axios';
import Cookies from 'js-cookie';
import { Tag } from 'pages/home/contents/_interfaces';
import { errorResponse, validResponse } from '../interface';
import { errorHandler, API_BASE_URL } from '../utils';

interface getTagsResponse extends validResponse {
  tags: Tag[];
}

export const getAllTags = async (): Promise<
  getTagsResponse | errorResponse
> => {
  const method = 'getChildTags';
  const endpoint = `${API_BASE_URL}/tags?parentTagId=@`;

  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${Cookies.get('access_token')}` },
    });
    const responseInfo = {
      method,
      status: response.status,
      message: '모든 태그를 가져오는 것을 성공했습니다.',
      tags: response.data,
    };
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const getChildTags = async (
  tagId: string
): Promise<getTagsResponse | errorResponse> => {
  const method = 'getChildTags';
  const endpoint = `${API_BASE_URL}/tags/${tagId}/childTags`;

  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${Cookies.get('access_token')}` },
    });
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
  const method = 'getRootTags';
  const endpoint = `${API_BASE_URL}/childTags`;

  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${Cookies.get('access_token')}` },
    });
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
