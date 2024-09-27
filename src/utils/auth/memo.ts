import axios from 'axios';
import { Memo, MemoSearchAnswer, Tag } from 'pages/home/contents/_interfaces';
import { errorHandler, LOCALHOST } from './errorHandler';
import { errorResponse, validResponse } from './types';
import Cookies from 'js-cookie';

interface searchMemoResponse extends MemoSearchAnswer, validResponse {}

export const searchMemo = async (
  inputContent: string
): Promise<searchMemoResponse | errorResponse> => {
  const method = 'searchMemo';
  const endpoint = `${LOCALHOST}/memos/search`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('access_token')}`,
    },
  };
  try {
    const response = await axios.post(
      endpoint,
      JSON.stringify({ content: inputContent }),
      config
    );
    const responseInfo = {
      method,
      status: response.status,
      text: response.data.processed_message,
      memos: response.data.memos,
    } as searchMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

interface cuMemoResponse extends Memo, validResponse {}

export const createMemo = async (
  inputContent: string,
  inputImageUrls?: string[]
): Promise<cuMemoResponse | errorResponse> => {
  const method = 'createMemo';
  const endpoint = `${LOCALHOST}/memo`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('access_token')}`,
    },
  };
  try {
    const response = await axios.post(
      endpoint,
      JSON.stringify({
        content: inputContent,
        image_urls: inputImageUrls ? inputImageUrls : [],
      }),
      config
    );
    const { id, content, tags, image_urls, created_at, updated_at } =
      response.data.memo;
    const responseInfo = {
      method,
      status: response.status,
      id,
      content,
      tags,
      image_urls,
      created_at,
      updated_at,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const updateMemo = async (
  id: string,
  content: string
): Promise<cuMemoResponse | errorResponse> => {
  const method = 'editMemo';
  const endpoint = `${LOCALHOST}/memos/${id}`;
  const data = JSON.stringify({
    content: content,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('access_token')}`,
    },
  };
  try {
    const response = await axios.put(endpoint, data, config);
    const { id, content, tags, image_urls, created_at, updated_at } =
      response.data.memo;
    const responseInfo = {
      method,
      status: response.status,
      id,
      content,
      tags,
      image_urls,
      created_at,
      updated_at,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const deleteMemo = async (
  id: string
): Promise<validResponse | errorResponse> => {
  const method = 'deleteMemo';
  const endpoint = `${LOCALHOST}/memos/${id}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('access_token')}`,
    },
  };
  try {
    const response = await axios.delete(endpoint, config);
    const { id, content, tags, image_urls, created_at, updated_at } =
      response.data.memo;
    const responseInfo = {
      method,
      status: response.status,
      id,
      content,
      tags,
      image_urls,
      created_at,
      updated_at,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

interface getMemosResponse extends validResponse {
  memos: Memo[];
}

export const getAllMemos = async (): Promise<
  getMemosResponse | errorResponse
> => {
  const method = 'getAllMemos';
  const endpoint = `${LOCALHOST}/memos`;

  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${Cookies.get('access_token')}` },
    });
    const responseInfo = {
      method,
      status: response.status,
      memos: response.data,
    } as getMemosResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const getMemosByTag = async (
  tagId: string
): Promise<getMemosResponse | errorResponse> => {
  const method = 'getMemosBySelectedTags';
  const endpoint = `${LOCALHOST}/memos/tags/${tagId}`;

  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${Cookies.get('access_token')}` },
    });
    const responseInfo = {
      method,
      status: response.status,
      message: '특정 태그의 메모 가져오는 것을 성공했습니다.',
      memos: response.data,
    };
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

interface getTagsResponse extends validResponse {
  tags: Tag[];
}

export const getAllTags = async (): Promise<
  getTagsResponse | errorResponse
> => {
  const method = 'getChildTags';
  const endpoint = `${LOCALHOST}/tags?parentTagId=@`;

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
  const endpoint = `${LOCALHOST}/tags/${tagId}/childTags`;

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
  const endpoint = `${LOCALHOST}/childTags`;

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

export const isValidResponse = (
  response: validResponse | errorResponse
): response is validResponse => {
  const validStatus = [200, 201, 202, 203, 204, 205, 206];
  return validStatus.includes(response.status);
};

export const isSearchMemoResponse = (
  response: searchMemoResponse | errorResponse
): response is searchMemoResponse => {
  return (response as searchMemoResponse).text !== undefined;
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

export const isGetMemosResponse = (
  response: getMemosResponse | errorResponse
): response is getMemosResponse => {
  return isValidResponse(response as getMemosResponse);
};

export const isGetTagsResponse = (
  response: getTagsResponse | errorResponse
): response is getTagsResponse => {
  return (response as getTagsResponse).tags !== undefined;
};
