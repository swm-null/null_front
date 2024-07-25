import axios from 'axios';
import { handleError, errorResponse } from 'utils/auth';
import { getMemosResponse, getTagsResponse } from './interface';
const LOCALHOST = import.meta.env.VITE_LOCALHOST;

export const getAllMemos = async (): Promise<
  getMemosResponse | errorResponse
> => {
  const method = 'getAllMemos';
  const endpoint = `${LOCALHOST}/memos`;

  try {
    const response = await axios.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      memos: response.data,
    } as getMemosResponse;
    return responseInfo;
  } catch (error) {
    return handleError(error, method);
  }
};

export const getSelectedTagMemos = async (
  tagId: string
): Promise<getMemosResponse | errorResponse> => {
  const method = 'getSelectedTagMemos';
  const endpoint = `${LOCALHOST}/memos/tags/${tagId}`;

  try {
    const response = await axios.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      message: '특정 태그의 메모 가져오는 것을 성공했습니다.',
      memos: response.data,
    };
    return responseInfo;
  } catch (error) {
    return handleError(error, method);
  }
};

export const getAllTags = async (): Promise<
  getTagsResponse | errorResponse
> => {
  const method = 'getChildTags';
  const endpoint = `${LOCALHOST}/tags`;

  try {
    const response = await axios.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      message: '모든 태그를 가져오는 것을 성공했습니다.',
      tags: response.data,
    };
    return responseInfo;
  } catch (error) {
    return handleError(error, method);
  }
};

export const getChildTags = async (
  tagId: string
): Promise<getTagsResponse | errorResponse> => {
  const method = 'getChildTags';
  const endpoint = `${LOCALHOST}/tags/${tagId}/childTags`;

  try {
    const response = await axios.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      message: '특정 태그의 자식 태그를 가져오는 것을 성공했습니다.',
      tags: response.data,
    };
    return responseInfo;
  } catch (error) {
    return handleError(error, method);
  }
};
